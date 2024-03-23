import styles from './page.module.css';
import { Tabs } from 'antd';
import { AppstoreAddOutlined, BookOutlined } from '@ant-design/icons';
import ArtWorks from '@/app/components/art-works/art-works';
import BookmarkedArtWorks from '@/app/components/bookmarked-art-works/bookmarked-art-works';

const tabItems = [
    {
        icon: AppstoreAddOutlined,
        children: ArtWorks,
        label: 'All Art Works',
    },
    {
        icon: BookOutlined,
        children: BookmarkedArtWorks,
        label: 'Bookmarked Art Works',
    },
];

export default function Home() {
    return (
        <Tabs
            defaultActiveKey="1"
            destroyInactiveTabPane={true}
            items={tabItems.map(
                ({ icon: Icon, label, children: Component }, i) => {
                    const id = String(i + 1);
                    return {
                        key: id,
                        label,
                        children: <Component />,
                        icon: <Icon />,
                    };
                }
            )}
        />
    );
}
