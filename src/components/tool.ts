
interface ToolItem<T> {
    data: T;
    eTime: number;
    createdAt: number;
    accessCount: number;
    lastAccessed: number;
}

interface ToolStats {
    totalItems: number;
    hitCount: number;
    missCount: number;
    memoryUsage: number;
    storageType: 'memory' | 'persistent';
}

interface ToolOptions {
    defaultTTL?: number;
    maxSize?: number;
    storageKey?: string;
    enableP?: boolean;
    cleanupInterval?: number;
}

export class Tool {
    private tool: Map<string, ToolItem<any>> = new Map();
    private stats: ToolStats;
    private options: Required<ToolOptions>;
    private cleanupTimer?: number;


    constructor(options: ToolOptions = {}) {
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

        this.startCleanupTask();
    }

    set<T>(key: string, data: T, ttl?: number): void {
        try {
            if (this.tool.size >= this.options.maxSize && !this.tool.has(key)) {
                this.evictLeastUsed();
            }

            const now = Date.now();
            const eTime = now + (ttl || this.options.defaultTTL);

            const toolItem: ToolItem<T> = {
                data,
                eTime,
                createdAt: now,
                accessCount: 0,
                lastAccessed: now
            };

            this.tool.set(key, toolItem);
            this.updateStats();

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

            if (!item) {
                this.stats.missCount++;
                return null;
            }

            const now = Date.now();

            if (now > item.eTime) {
                this.tool.delete(key);
                this.stats.missCount++;
                this.updateStats();
                return null;
            }

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

    delete(key: string): boolean {
        try {
            const deleted = this.tool.delete(key);
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

    has(key: string): boolean {
        const item = this.tool.get(key);
        if (!item) return false;

        if (Date.now() > item.eTime) {
            this.tool.delete(key);
            return false;
        }

        return true;
    }

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

    getStats(): ToolStats {
        return { ...this.stats };
    }

    cleanup(): number {
        const now = Date.now();
        let deletedCount = 0;

        for (const [key, item] of this.tool.entries()) {
            if (now > item.eTime) {
                this.tool.delete(key);
                deletedCount++;
            }
        }

        if (deletedCount > 0) {
            this.updateStats();
            if (this.options.enableP) {
                this.saveToStorage();
            }
        }

        return deletedCount;
    }

    private evictLeastUsed(): void {
        let leastUsedKey: string | null = null;
        let minAccessCount = Infinity;
        let oldestAccessTime = Infinity;

        for (const [key, item] of this.tool.entries()) {
            if (item.accessCount < minAccessCount ||
                (item.accessCount === minAccessCount && item.lastAccessed < oldestAccessTime)) {
                leastUsedKey = key;
                minAccessCount = item.accessCount;
                oldestAccessTime = item.lastAccessed;
            }
        }

        if (leastUsedKey) {
            this.tool.delete(leastUsedKey);
        }
    }

    private loadFromStorage(): void {
        try {
            const stored = localStorage.getItem(this.options.storageKey);
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


    private saveToStorage(): void {
        try {
            const serialized = JSON.stringify(Array.from(this.tool.entries()));
            localStorage.setItem(this.options.storageKey, serialized);
        } catch (error) {
            console.error(error);
        }
    }

    private updateStats(): void {
        this.stats.totalItems = this.tool.size;

        let size = 0;
        for (const [key, value] of this.tool.entries()) {
            size += key.length + JSON.stringify(value).length;
        }
        this.stats.memoryUsage = size;
    }

    private startCleanupTask(): void {
        this.cleanupTimer = window.setInterval(() => {
            this.cleanup();
        }, this.options.cleanupInterval);
    }

    destroy(): void {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
        }
    }
}

export const globalTool = new Tool();