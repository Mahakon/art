import styles from './card.module.css';
import Paragraph from 'antd/es/typography/Paragraph';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { ICard } from '@/components/card/card.interface';
import Link from 'next/link';
import { useState } from 'react';
import { StorageService } from '@/services/local-storage/storage.service';

export function CardWrapper({ id, imageUrl, description, title }: ICard) {
    const [isFavorite, setIsFavorite] = useState(
        StorageService.getIds().has(id)
    );

    const onFavoriteChange = () => {
        if (isFavorite) {
            StorageService.deleteId(id);
        } else {
            StorageService.addId(id);
        }

        setIsFavorite(!isFavorite);
    };

    return (
        <div className={styles.cardContainer}>
            <div className={styles.thumbnailContainer}>
                <Link href={`${id}`}>
                    <img
                        className={styles.zoomImage}
                        src={imageUrl}
                        alt={title}
                    ></img>
                </Link>
            </div>
            <div className={styles.infoContainer}>
                <Paragraph className={styles.title} ellipsis>
                    {title}
                </Paragraph>
                <Paragraph
                    className={styles.description}
                    ellipsis={{ rows: 2, tooltip: description }}
                >
                    {description}
                </Paragraph>
            </div>
            <div className={styles.actionsContainer}>
                <div
                    className={styles.actionBookmark}
                    onClick={onFavoriteChange}
                >
                    {isFavorite ? <HeartFilled /> : <HeartOutlined />}
                </div>
            </div>
        </div>
    );
}
