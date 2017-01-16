/**
 * Process certain events in the specific datastructure
 */
export interface OperationService {
    createNode(id: string, label: string): void;
    createLink(id: string, source: string, targets: string, labels: string): void;
    updateNode(id: string, label: string): void;
    updateLink(id: string, source: string, targets: string, labels: string): void;
    deleteNode(id: string): void;
    deleteLink(id: string): void;
}