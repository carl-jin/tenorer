declare type EventObj<T> = {
    [K in keyof T]: (...args: any) => void;
};
declare class BaseEvent<T extends EventObj<T>> {
    private eventList;
    $on<K extends keyof T>(eventName: K, handler: T[K]): void;
    $off<K extends keyof T>(eventName: K, handler: T[K]): void;
    $emit<K extends keyof T>(eventName: K, ...payload: Parameters<T[K]>): void;
}
export { BaseEvent };
