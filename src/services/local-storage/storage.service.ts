import { Id } from '@/services/api/art-works-api.service';

const bookmarkedArtWorkIdsKey = 'bookmarked-artwork-ids';

export class StorageService {
    static getIds(): Set<Id> {
        const value = localStorage.getItem(bookmarkedArtWorkIdsKey);

        if (!value) {
            return new Set<Id>();
        }

        return new Set(JSON.parse(value));
    }

    static deleteId(id: Id) {
        const store = StorageService.getIds();

        store.delete(id);

        StorageService.saveIds(Array.from(store.values()));
    }

    static addId(id: Id) {
        const store = StorageService.getIds();

        store.add(id);

        StorageService.saveIds(Array.from(store.values()));
    }

    private static saveIds(ids: Id[]) {
        localStorage.setItem(bookmarkedArtWorkIdsKey, JSON.stringify(ids));
    }
}
