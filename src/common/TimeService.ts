
/** This module provides Time related methods */

export module TimeService {
    /**
     * Return the actual time as millisecond timestamp
     * @returns {string}
     */
    export function getTimestamp(): string {
        return (new Date).getTime().toString()
    }
}