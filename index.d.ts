declare module 'bootprint' {
    interface Object {
      type: string;        // The requested object type (e.g., 'earth')
      object: string;      // The object name from the API (e.g., 'earth')
      image: string;       // URL of the image
      fact: string;        // A fact about the object
      image_id: string;    // Unique identifier for the image
      fact_id: string;     // Unique identifier for the fact
    }
  
    namespace fns {
      /**
       * Returns an image and a fact of the specified object type(s).
       * @param type The object type(s), defaults to 'random'.
       * @returns A promise resolving to a single Object or an array of Object.
       */
      export function getAsync(type?: string | string[]): Promise<Object | Object[]>;
    }
  
    export = fns;
  }