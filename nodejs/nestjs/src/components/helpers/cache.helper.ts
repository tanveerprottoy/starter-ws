import { Injectable } from "@nestjs/common";
import { Cache } from 'cache-manager';

@Injectable()
export class CacheHelper {

    async get(
        key: string,
        cacheManager: Cache
    ): Promise<any> {
        return await cacheManager.get(key);
    }

    async set(
        key: string,
        val: any,
        ttl: number,
        cacheManager: Cache
    ): Promise<any> {
        return await cacheManager.set(key, val, ttl);
    }

    async delete(
        key: string,
        cacheManager: Cache
    ): Promise<any> {
        return await cacheManager.del(key);
    }
}