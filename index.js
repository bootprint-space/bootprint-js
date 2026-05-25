const objects = [
    'sun',
    'mercury',
    'venus',
    'earth',
    'mars',
    'jupiter',
    'saturn',
    'uranus',
    'neptune',
    'moon'
];

/**
 * @typedef {Object} Object
 * @property {string} type - The object type (e.g., 'earth', 'moon')
 * @property {string} object - The name of the object
 * @property {string} image - URL of an image of the object
 * @property {string} fact - A fact about the object
 * @property {string} image_id - Unique identifier for the image
 * @property {string} fact_id - Unique identifier for the fact
 */

module.exports = {
    /**
     * Returns an image and a fact of the specified object type(s).
     * @param {string | string[]} [type='random'] The object type(s).
     * @returns {Object | Object[]} The data object(s).
     */
    async getAsync(type = 'random') {
        const isArray = Array.isArray(type);
        if ((typeof type !== 'string' && !isArray) || (isArray && (type = type.flat()) && !type.every(t => typeof t === 'string'))) {
            throw new TypeError("'type' must be a string or an array of strings");
        }

        type = type === 'random' 
            ? celestialObjects[Math.floor(Math.random() * celestialObjects.length)] 
            : !isArray 
                ? type.toLowerCase() 
                : [...new Set(type.map(t => t.toLowerCase()))];
        
        if (!isArray && !celestialObjects.includes(type)) {
            throw new TypeError(`'${type}' is not a valid type, the valid types are: ${celestialObjects.join(', ')}, random`);
        }
     
        if (isArray) {
            return Promise.all(type.map(t => this.getAsync(t)));
        }

        try {
            const res = await fetch(`https://api.bootprint.space/all/${type}`);
            
            if (!res.ok) {
                throw new Error(`API responded with status code: ${res.status}`);
            }

            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new TypeError(`Expected JSON payload, but received: ${contentType}`);
            }

            const response = await res.json();

            const object = response.object || type;
            const image = response.image || response.img || '';
            const fact = response.fact || 'No object details provided.';
            const image_id = response.image_id || response.img_id || '';
            const fact_id = response.fact_id || '';

            return { type, object, image, fact, image_id, fact_id };
        } catch (err) {
            throw new Error(`Failed to get type '${type}' from API:\n${err.message || err}`);
        }
    }
};