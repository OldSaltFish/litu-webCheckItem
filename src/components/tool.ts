
/**
 * Tool存储项接口
 * @interface ToolItem
 * @property {T} data - 存储的数据
 * @property {number} eTime - 过期时间戳
 * @property {number} createdAt - 创建时间戳
 * @property {number} accessCount - 访问次数
 * @property {number} lastAccessed - 上次访问时间戳
 */
interface ToolItem<T> {
    data: T;
    eTime: number;
    createdAt: number;
    accessCount: number;
    lastAccessed: number;
}
/**
 * Tool类统计信息接口
 * @interface ToolStats
 * @property {number} totalItems - 当前存储项总数
 * @property {number} hitCount - 命中次数
 * @property {number} missCount - 未命中次数
 * @property {number} memoryUsage - 内存使用量，单位字节
 * @property {'memory' | 'persistent'} storageType - 存储类型，内存或持久化
 */
interface ToolStats {
    totalItems: number;
    hitCount: number;
    missCount: number;
    memoryUsage: number;
    storageType: 'memory' | 'persistent';
}
/**
 * Tool类选项接口
 * @interface ToolOptions
 * @property {number} [defaultTTL] - 默认的存活时间，单位毫秒，默认30分钟
 * @property {number} [maxSize] - 最大存储项数量，默认1000
 * @property {string} [storageKey] - 本地存储的键名，默认'advanced_tool'
 * @property {boolean} [enableP] - 是否启用持久化存储，默认true
 * @property {number} [cleanupInterval] - 定时清理过期数据的间隔时间，单位毫秒，默认
 */
interface ToolOptions {
    defaultTTL?: number;
    maxSize?: number;
    storageKey?: string;
    enableP?: boolean;
    cleanupInterval?: number;
}
// 导出Tool类
export class Tool {
    private tool: Map<string, ToolItem<any>> = new Map();
    private stats: ToolStats;
    private options: Required<ToolOptions>;
    private cleanupTimer?: number;


    constructor(options: ToolOptions = {}) {
        // 提供配置缺省值，如果设置则会覆盖该配置。
        this.options = {
            defaultTTL: 30 * 60 * 1000,
            maxSize: 1000,
            storageKey: 'advanced_tool',
            enableP: true,
            cleanupInterval: 5 * 60 * 1000,
            ...options
        };

        this.stats = {
            totalItems: 0,
            hitCount: 0,
            missCount: 0,
            memoryUsage: 0,
            storageType: this.options.enableP ? 'persistent' : 'memory'
        };

        if (this.options.enableP) {
            this.loadFromStorage();
        }
        // 开启定时清理任务，每隔一段时间清理过期数据
        this.startCleanupTask();
    }
    /**
     * 
     * @param key 键名
     * @param data 数据
     * @param ttl 过期时间
     */
    set<T>(key: string, data: T, ttl?: number): void {
        try {
            // 如果达到最大容量，先删除最少使用的项
            if (this.tool.size >= this.options.maxSize && !this.tool.has(key)) {
                this.evictLeastUsed();
            }

            const now = Date.now();
            // 计算过期时间，如果传入ttl则使用，否则使用默认ttl
            const eTime = now + (ttl || this.options.defaultTTL);
            // 创建存储项
            const toolItem: ToolItem<T> = {
                data,
                eTime,
                createdAt: now,
                accessCount: 0,
                lastAccessed: now
            };
            
            this.tool.set(key, toolItem);
            // 更新状态统计信息
            this.updateStats();
            // 如果启用持久化，保存到本地存储
            if (this.options.enableP) {
                this.saveToStorage();
            }
        } catch (error) {
            console.error(`[key: ${key}]:`, error);
            throw new Error(`${error instanceof Error ? error.message : '未知错误'}`);
        }
    }

    get<T>(key: string): T | null {
        try {
            const item = this.tool.get(key) as ToolItem<T> | undefined;
            // 如果不存在该项，记录未命中并返回null
            if (!item) {
                this.stats.missCount++;
                return null;
            }

            const now = Date.now();
            // 过期判定，过期则删除该项，记录未命中并返回null
            if (now > item.eTime) {
                this.tool.delete(key);
                this.stats.missCount++;
                this.updateStats();
                return null;
            }
            // 否则表明命中，更新访问次数和上次访问时间
            item.accessCount++;
            item.lastAccessed = now;
            this.stats.hitCount++;

            if (this.options.enableP) {
                this.saveToStorage();
            }

            return item.data;
        } catch (error) {
            console.error(`[key: ${key}]:`, error);
            this.stats.missCount++;
            return null;
        }
    }
    /**
     * 删除指定键
     */
    delete(key: string): boolean {
        try {
            const deleted = this.tool.delete(key);
            // 删除了则更新状态，以及保存到本地存储（如果开启）
            if (deleted) {
                this.updateStats();
                if (this.options.enableP) {
                    this.saveToStorage();
                }
            }
            return deleted;
        } catch (error) {
            console.error(`[key: ${key}]:`, error);
            return false;
        }
    }
    /**
     * 检查是否存在指定键
     */
    has(key: string): boolean {
        const item = this.tool.get(key);
        if (!item) return false;
        // 过期判定，过期则删除，则键不存在
        if (Date.now() > item.eTime) {
            this.tool.delete(key);
            return false;
        }

        return true;
    }

    /**
     * 清空所有数据
     */
    clear(): void {
        try {
            this.tool.clear();
            this.updateStats();

            if (this.options.enableP) {
                localStorage.removeItem(this.options.storageKey);
            }
        } catch (error) {
            console.error(error);
            throw new Error(`${error instanceof Error ? error.message : '未知错误'}`);
        }
    }
    /**
     * 获取当前统计信息
     */
    getStats(): ToolStats {
        return { ...this.stats };
    }
    /**
     * 清理过期数据
     * @return {number} - 删除的项数量
     */
    cleanup(): number {
        const now = Date.now();
        let deletedCount = 0;

        for (const [key, item] of this.tool.entries()) {
            // 如果当前时间超过了过期时间，则删除该项
            if (now > item.eTime) {
                this.tool.delete(key);
                deletedCount++;
            }
        }
        // 如果有删除项，更新状态并保存
        if (deletedCount > 0) {
            this.updateStats();
            if (this.options.enableP) {
                this.saveToStorage();
            }
        }

        return deletedCount;
    }
    /**
     * 删除最少使用的项
     */
    private evictLeastUsed(): void {
        let leastUsedKey: string | null = null;
        let minAccessCount = Infinity;
        let oldestAccessTime = Infinity;
        // 遍历找到访问次数最少的项目，如果有多个，选择上次访问时间最早的那个
        for (const [key, item] of this.tool.entries()) {
            if (item.accessCount < minAccessCount ||
                (item.accessCount === minAccessCount && item.lastAccessed < oldestAccessTime)) {
                leastUsedKey = key;
                minAccessCount = item.accessCount;
                // 一直更新，直到找到上次访问最早的时间
                oldestAccessTime = item.lastAccessed;
            }
        }

        if (leastUsedKey) {
            this.tool.delete(leastUsedKey);
        }
    }
    /**
     * 从本地加载数据，
     */
    private loadFromStorage(): void {
        try {
            const stored = localStorage.getItem(this.options.storageKey);
            // 如果有存储数据，则解析并加载到内存中
            if (stored) {
                const parsed = JSON.parse(stored);
                this.tool = new Map(parsed);
                this.updateStats();
            }
        } catch (error) {
            console.error(error);
            localStorage.removeItem(this.options.storageKey);
        }
    }

    /**
     * 保存数据到本地存储，localStorage中
     */
    private saveToStorage(): void {
        try {
            const serialized = JSON.stringify(Array.from(this.tool.entries()));
            localStorage.setItem(this.options.storageKey, serialized);
        } catch (error) {
            console.error(error);
        }
    }
    /**
     * 更新状态统计信息
     */
    private updateStats(): void {
        this.stats.totalItems = this.tool.size;
        // 计算内存使用量的简单估算，单位为字节
        let size = 0;
        for (const [key, value] of this.tool.entries()) {
            size += key.length + JSON.stringify(value).length;
        }
        this.stats.memoryUsage = size;
    }
    /**
     * 启动定时清理任务
     */
    private startCleanupTask(): void {
        this.cleanupTimer = window.setInterval(() => {
            this.cleanup();
        }, this.options.cleanupInterval);
    }
    // 析构函数，清理定时器，防止内存泄漏
    destroy(): void {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
        }
    }
}
// 导出Tool类的单实例
export const globalTool = new Tool();