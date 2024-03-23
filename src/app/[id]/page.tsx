'use client';

import styles from './page.module.css';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import {
    ArtWork,
    ArtWorksApiService,
} from '@/services/api/art-works-api.service';
import { StorageService } from '@/services/local-storage/storage.service';
import { Empty, Spin } from 'antd';

export default function Page({ params }: { params: { id: number } }) {
    const { id } = params;

    const [artWork, setArtWork] = useState<ArtWork | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFavorite] = useState<boolean>(StorageService.getIds().has(id));

    useEffect(() => {
        (async function init() {
            setIsLoading(true);

            const artWork = await ArtWorksApiService.getArtWorkById(id);

            setArtWork(artWork);
            setIsLoading(false);
        })();
    }, []);

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <Spin />
            </div>
        );
    }

    if (!artWork) {
        return (
            <div className={styles.emptyContainer}>
                <Empty />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                <img
                    className={styles.image}
                    src={artWork.imageUrl}
                    alt={artWork.title}
                />
            </div>

            <div className={styles.infoContainer}>
                <h1>{artWork.title}</h1>

                <p className={styles.description}>{artWork.description}</p>

                {isFavorite ? <HeartFilled /> : <HeartOutlined />}
            </div>
        </div>
    );
}
