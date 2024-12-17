/* eslint-disable @next/next/no-img-element */

import React, { useContext, useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const [menuItem, setMenuItem] = useState<AppMenuItem[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const model: AppMenuItem[] = [
        {
            label: 'Wedding Invitations',
            items: [{ label: 'Content', icon: 'pi pi-fw pi-calendar', to: '/content/wedding-invitation' }]
        }
    ];
    // useEffect(() => {
    //     const fetchMenu = async () => {
    //         setIsLoading(true);
    //         setError(null);

    //         try {
    //             const userData = await getMenu();
    //             setMenuItem(userData);
    //         } catch (err: any) {
    //             console.log(err);
    //             setError(new Error('Failed to fetch menu data'));
    //             setMenuItem(null);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };

    //     fetchMenu();
    //  }, []);

    // const model: AppMenuItem[] = menuItem || [];

    // if (isLoading) return <div>Loading...</div>;
    // if (error) return <div>{error.message}</div>;
    // if (!model.length) return <div>No menu items available</div>;

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
