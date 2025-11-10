/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const Person = $root.Person = (() => {

    /**
     * Properties of a Person.
     * @exports IPerson
     * @interface IPerson
     * @property {string|null} [id] Person id
     * @property {string|null} [name] Person name
     * @property {string|null} [email] Person email
     * @property {string|null} [phone] Person phone
     * @property {number|null} [status] Person status
     * @property {number|null} [creditScore] Person creditScore
     * @property {number|null} [gender] Person gender
     */

    /**
     * Constructs a new Person.
     * @exports Person
     * @classdesc Represents a Person.
     * @implements IPerson
     * @constructor
     * @param {IPerson=} [properties] Properties to set
     */
    function Person(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Person id.
     * @member {string} id
     * @memberof Person
     * @instance
     */
    Person.prototype.id = "";

    /**
     * Person name.
     * @member {string} name
     * @memberof Person
     * @instance
     */
    Person.prototype.name = "";

    /**
     * Person email.
     * @member {string} email
     * @memberof Person
     * @instance
     */
    Person.prototype.email = "";

    /**
     * Person phone.
     * @member {string} phone
     * @memberof Person
     * @instance
     */
    Person.prototype.phone = "";

    /**
     * Person status.
     * @member {number} status
     * @memberof Person
     * @instance
     */
    Person.prototype.status = 0;

    /**
     * Person creditScore.
     * @member {number} creditScore
     * @memberof Person
     * @instance
     */
    Person.prototype.creditScore = 0;

    /**
     * Person gender.
     * @member {number} gender
     * @memberof Person
     * @instance
     */
    Person.prototype.gender = 0;

    /**
     * Creates a new Person instance using the specified properties.
     * @function create
     * @memberof Person
     * @static
     * @param {IPerson=} [properties] Properties to set
     * @returns {Person} Person instance
     */
    Person.create = function create(properties) {
        return new Person(properties);
    };

    /**
     * Encodes the specified Person message. Does not implicitly {@link Person.verify|verify} messages.
     * @function encode
     * @memberof Person
     * @static
     * @param {IPerson} message Person message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Person.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.id != null && Object.hasOwnProperty.call(message, "id"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
        if (message.email != null && Object.hasOwnProperty.call(message, "email"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.email);
        if (message.phone != null && Object.hasOwnProperty.call(message, "phone"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.phone);
        if (message.status != null && Object.hasOwnProperty.call(message, "status"))
            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.status);
        if (message.creditScore != null && Object.hasOwnProperty.call(message, "creditScore"))
            writer.uint32(/* id 6, wireType 0 =*/48).int32(message.creditScore);
        if (message.gender != null && Object.hasOwnProperty.call(message, "gender"))
            writer.uint32(/* id 7, wireType 0 =*/56).int32(message.gender);
        return writer;
    };

    /**
     * Encodes the specified Person message, length delimited. Does not implicitly {@link Person.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Person
     * @static
     * @param {IPerson} message Person message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Person.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Person message from the specified reader or buffer.
     * @function decode
     * @memberof Person
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Person} Person
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Person.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Person();
        while (reader.pos < end) {
            let tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.id = reader.string();
                    break;
                }
            case 2: {
                    message.name = reader.string();
                    break;
                }
            case 3: {
                    message.email = reader.string();
                    break;
                }
            case 4: {
                    message.phone = reader.string();
                    break;
                }
            case 5: {
                    message.status = reader.int32();
                    break;
                }
            case 6: {
                    message.creditScore = reader.int32();
                    break;
                }
            case 7: {
                    message.gender = reader.int32();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Person message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Person
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Person} Person
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Person.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Person message.
     * @function verify
     * @memberof Person
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Person.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isString(message.id))
                return "id: string expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        if (message.email != null && message.hasOwnProperty("email"))
            if (!$util.isString(message.email))
                return "email: string expected";
        if (message.phone != null && message.hasOwnProperty("phone"))
            if (!$util.isString(message.phone))
                return "phone: string expected";
        if (message.status != null && message.hasOwnProperty("status"))
            if (!$util.isInteger(message.status))
                return "status: integer expected";
        if (message.creditScore != null && message.hasOwnProperty("creditScore"))
            if (!$util.isInteger(message.creditScore))
                return "creditScore: integer expected";
        if (message.gender != null && message.hasOwnProperty("gender"))
            if (!$util.isInteger(message.gender))
                return "gender: integer expected";
        return null;
    };

    /**
     * Creates a Person message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Person
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Person} Person
     */
    Person.fromObject = function fromObject(object) {
        if (object instanceof $root.Person)
            return object;
        let message = new $root.Person();
        if (object.id != null)
            message.id = String(object.id);
        if (object.name != null)
            message.name = String(object.name);
        if (object.email != null)
            message.email = String(object.email);
        if (object.phone != null)
            message.phone = String(object.phone);
        if (object.status != null)
            message.status = object.status | 0;
        if (object.creditScore != null)
            message.creditScore = object.creditScore | 0;
        if (object.gender != null)
            message.gender = object.gender | 0;
        return message;
    };

    /**
     * Creates a plain object from a Person message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Person
     * @static
     * @param {Person} message Person
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Person.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.id = "";
            object.name = "";
            object.email = "";
            object.phone = "";
            object.status = 0;
            object.creditScore = 0;
            object.gender = 0;
        }
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.email != null && message.hasOwnProperty("email"))
            object.email = message.email;
        if (message.phone != null && message.hasOwnProperty("phone"))
            object.phone = message.phone;
        if (message.status != null && message.hasOwnProperty("status"))
            object.status = message.status;
        if (message.creditScore != null && message.hasOwnProperty("creditScore"))
            object.creditScore = message.creditScore;
        if (message.gender != null && message.hasOwnProperty("gender"))
            object.gender = message.gender;
        return object;
    };

    /**
     * Converts this Person to JSON.
     * @function toJSON
     * @memberof Person
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Person.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for Person
     * @function getTypeUrl
     * @memberof Person
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    Person.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/Person";
    };

    return Person;
})();

export const PersonList = $root.PersonList = (() => {

    /**
     * Properties of a PersonList.
     * @exports IPersonList
     * @interface IPersonList
     * @property {Array.<IPerson>|null} [persons] PersonList persons
     */

    /**
     * Constructs a new PersonList.
     * @exports PersonList
     * @classdesc Represents a PersonList.
     * @implements IPersonList
     * @constructor
     * @param {IPersonList=} [properties] Properties to set
     */
    function PersonList(properties) {
        this.persons = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PersonList persons.
     * @member {Array.<IPerson>} persons
     * @memberof PersonList
     * @instance
     */
    PersonList.prototype.persons = $util.emptyArray;

    /**
     * Creates a new PersonList instance using the specified properties.
     * @function create
     * @memberof PersonList
     * @static
     * @param {IPersonList=} [properties] Properties to set
     * @returns {PersonList} PersonList instance
     */
    PersonList.create = function create(properties) {
        return new PersonList(properties);
    };

    /**
     * Encodes the specified PersonList message. Does not implicitly {@link PersonList.verify|verify} messages.
     * @function encode
     * @memberof PersonList
     * @static
     * @param {IPersonList} message PersonList message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PersonList.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.persons != null && message.persons.length)
            for (let i = 0; i < message.persons.length; ++i)
                $root.Person.encode(message.persons[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified PersonList message, length delimited. Does not implicitly {@link PersonList.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PersonList
     * @static
     * @param {IPersonList} message PersonList message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PersonList.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PersonList message from the specified reader or buffer.
     * @function decode
     * @memberof PersonList
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PersonList} PersonList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PersonList.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.PersonList();
        while (reader.pos < end) {
            let tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    if (!(message.persons && message.persons.length))
                        message.persons = [];
                    message.persons.push($root.Person.decode(reader, reader.uint32()));
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PersonList message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PersonList
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PersonList} PersonList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PersonList.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PersonList message.
     * @function verify
     * @memberof PersonList
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PersonList.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.persons != null && message.hasOwnProperty("persons")) {
            if (!Array.isArray(message.persons))
                return "persons: array expected";
            for (let i = 0; i < message.persons.length; ++i) {
                let error = $root.Person.verify(message.persons[i]);
                if (error)
                    return "persons." + error;
            }
        }
        return null;
    };

    /**
     * Creates a PersonList message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PersonList
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PersonList} PersonList
     */
    PersonList.fromObject = function fromObject(object) {
        if (object instanceof $root.PersonList)
            return object;
        let message = new $root.PersonList();
        if (object.persons) {
            if (!Array.isArray(object.persons))
                throw TypeError(".PersonList.persons: array expected");
            message.persons = [];
            for (let i = 0; i < object.persons.length; ++i) {
                if (typeof object.persons[i] !== "object")
                    throw TypeError(".PersonList.persons: object expected");
                message.persons[i] = $root.Person.fromObject(object.persons[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a PersonList message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PersonList
     * @static
     * @param {PersonList} message PersonList
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PersonList.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.persons = [];
        if (message.persons && message.persons.length) {
            object.persons = [];
            for (let j = 0; j < message.persons.length; ++j)
                object.persons[j] = $root.Person.toObject(message.persons[j], options);
        }
        return object;
    };

    /**
     * Converts this PersonList to JSON.
     * @function toJSON
     * @memberof PersonList
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PersonList.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for PersonList
     * @function getTypeUrl
     * @memberof PersonList
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    PersonList.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/PersonList";
    };

    return PersonList;
})();

export { $root as default };
