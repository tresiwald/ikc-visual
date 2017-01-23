export module TimeService {
    export function getTimestamp(): string {
        return (new Date).getTime().toString()
    }
}