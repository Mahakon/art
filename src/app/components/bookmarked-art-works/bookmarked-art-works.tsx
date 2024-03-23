'use client';

import { Pagination, Spin } from 'antd';
import {
    ArtWork,
    ArtWorksApiService,
    Id,
    limit,
} from '@/services/api/art-works-api.service';
import { useCallback, useEffect, useState } from 'react';
import { StorageService } from '@/services/local-storage/storage.service';
import styles from './bookmarked-art-works.module.css';
import CardList from '@/components/card-list/card-list';

type PaginationState = {
    currentPage: number;
    total: number;
} | null;

export default function BookmarkedArtWorks() {
    const [artWorkList, setArtWorkList] = useState<ArtWork[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [paginationState, setPaginationState] =
        useState<PaginationState>(null);
    const [ids] = useState<Id[]>(Array.from(StorageService.getIds()));

    const handleStateChange = useCallback(async (ids: Id[], page: number) => {
        setIsLoading(true);

        if (ids.length === 0) {
            setArtWorkList([]);
            setPaginationState(null);
            setIsLoading(false);

            return;
        }

        const data = await ArtWorksApiService.getArtWorksByIds(ids, page);

        if (!data) {
            setArtWorkList([]);
            setPaginationState(null);
            setIsLoading(false);

            return;
        }

        const { works, total } = data;

        setArtWorkList(works);
        setPaginationState({
            currentPage: page,
            total,
        });
        setIsLoading(false);
    }, []);

    useEffect(() => {
        (async function init() {
            await handleStateChange(ids, 1);
        })();
    }, []);

    return (
        <>
            {isLoading && (
                <div className={styles.loadingContainer}>
                    <Spin />
                </div>
            )}

            {!isLoading && <CardList cards={artWorkList}></CardList>}

            {paginationState && (
                <Pagination
                    simple
                    defaultCurrent={paginationState.currentPage}
                    total={paginationState.total}
                    pageSize={limit}
                    onChange={(page) => handleStateChange(ids, page)}
                    showSizeChanger={false}
                />
            )}
        </>
    );
}
