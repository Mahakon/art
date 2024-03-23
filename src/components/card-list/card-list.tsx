import { ICard } from '@/components/card/card.interface';
import { CardWrapper } from '@/components/card/card-wrapper';
import styles from './card-list.module.css';
import { Id } from '@/services/api/art-works-api.service';

export default function CardList({ cards }: { cards: ICard[] }) {
    return (
        <div className={styles.container}>
            {cards.map((card) => {
                return <CardWrapper key={card.id} {...card}></CardWrapper>;
            })}
        </div>
    );
}
