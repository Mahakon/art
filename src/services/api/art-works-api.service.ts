export type Id = number;

export type ArtWork = {
    id: Id;
    title: string;
    description: string;
    imageUrl: string;
};

export const limit = 6;

export class ArtWorksApiService {
    static async search(
        value: string,
        isPublicDomain = false,
        page = 1
    ): Promise<{ works: ArtWork[]; total: number } | null> {
        try {
            const res = await fetch(
                `https://api.artic.edu/api/v1/artworks/search?limit=${limit}&q=${value}&page=${page}&fields=image_id,id,thumbnail,title&query[term][is_public_domain]=${isPublicDomain}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const json = await res.json();
            const data = json?.data;

            if (!data || !Array.isArray(data)) {
                return null;
            }

            const total = json?.['pagination']?.['total'];

            if (!total || typeof total !== 'number') {
                return null;
            }

            const works = data.reduce((prev, cur) => {
                if (!cur.id) {
                    return prev;
                }

                const artWork: ArtWork = {
                    id: cur.id,
                    title: cur.title,
                    description: cur?.['thumbnail']?.['alt_text'] ?? '',
                    imageUrl: `${json['config']['iiif_url']}/${cur['image_id']}/full/843,/0/default.jpg`,
                };

                return [...prev, artWork];
            }, []);

            return {
                works,
                total,
            };
        } catch (e) {
            return null;
        }
    }

    static async getArtWorksByIds(
        ids: Id[],
        page: number = 1
    ): Promise<{ works: ArtWork[]; total: number } | null> {
        try {
            const res = await fetch(
                `https://api.artic.edu/api/v1/artworks?limit=${limit}&ids=${ids.join(',')}&page=${page}&fields=image_id,id,thumbnail,title`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const json = await res.json();
            const data = json?.data;

            if (!data || !Array.isArray(data)) {
                return null;
            }

            const works = data.reduce((prev, cur) => {
                if (!cur.id) {
                    return prev;
                }

                const artWork: ArtWork = {
                    id: cur.id,
                    title: cur.title,
                    description: cur?.['thumbnail']?.['alt_text'] ?? '',
                    imageUrl: `${json['config']['iiif_url']}/${cur['image_id']}/full/843,/0/default.jpg`,
                };

                return [...prev, artWork];
            }, []);

            return {
                works,
                total: works.length,
            };
        } catch (e) {
            return null;
        }
    }

    static async getArtWorkById(id: Id): Promise<ArtWork | null> {
        try {
            const res = await fetch(
                `https://api.artic.edu/api/v1/artworks/${id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const json = await res.json();
            const data = json?.data;

            if (!data) {
                return null;
            }

            return {
                id: data.id,
                title: data.title,
                description: data?.['thumbnail']?.['alt_text'] ?? '',
                imageUrl: `${json['config']['iiif_url']}/${data['image_id']}/full/843,/0/default.jpg`,
            };
        } catch (e) {
            return null;
        }
    }
}
