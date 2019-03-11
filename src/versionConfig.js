const version = '1.0.3';

self.__version = version;

if (typeof window !== 'undefined') {
    window.__version = version;
}