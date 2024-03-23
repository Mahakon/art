'use client';

import Search from 'antd/es/input/Search';
import { useCallback, useState } from 'react';
import { Checkbox, Pagination, Spin } from 'antd';
import {
    ArtWork,
    ArtWorksApiService,
    limit,
} from '@/services/api/art-works-api.service';
import CardList from '@/components/card-list/card-list';
import styles from './art-works.module.css';

type PaginationState = {
    currentPage: number;
    total: number;
} | null;

type Filters = { isPublicDomain: boolean };

export default function ArtWorks() {
    const [artWorkList, setArtWorkList] = useState<ArtWork[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [paginationState, setPaginationState] =
        useState<PaginationState>(null);
    const [value, setValue] = useState<string>('');
    const [filters, setFilters] = useState<Filters>({ isPublicDomain: false });

    const handleStateChange = useCallback(
        async (value: string, page: number, filters: Filters) => {
            setIsLoading(true);

            if (!value) {
                setArtWorkList([]);
                setPaginationState(null);
                setIsLoading(false);
                setFilters({ isPublicDomain: false });

                return;
            }

            const data = await ArtWorksApiService.search(
                value,
                filters.isPublicDomain,
                page
            );

            if (!data) {
                setArtWorkList([]);
                setPaginationState(null);
                setIsLoading(false);
                setFilters({ isPublicDomain: false });

                return;
            }

            const { works, total } = data;

            setArtWorkList(works);
            setPaginationState({
                currentPage: page,
                total,
            });
            setValue(value);
            setIsLoading(false);
            setFilters(filters);
        },
        []
    );

    return (
        <>
            <Search
                placeholder="input search text"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={(inputValue) =>
                    handleStateChange(
                        inputValue,
                        paginationState?.currentPage ?? 1,
                        filters
                    )
                }
            />
            <Checkbox
                onChange={() =>
                    handleStateChange(
                        value,
                        paginationState?.currentPage ?? 1,
                        {
                            ...filters,
                            isPublicDomain: !filters.isPublicDomain,
                        }
                    )
                }
            >
                Public domain
            </Checkbox>

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
                    onChange={(page) => handleStateChange(value, page, filters)}
                    showSizeChanger={false}
                />
            )}
        </>
    );
}
