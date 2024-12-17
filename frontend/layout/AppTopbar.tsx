/* eslint-disable @next/next/no-img-element */

import { AppTopbarRef, Demo, LayoutState } from '@/types';
import Link from 'next/link';
import { classNames } from 'primereact/utils';
import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { LayoutContext } from './context/layoutcontext';
import { logout } from '@/service/user.service';
import { useRouter } from 'next/navigation';
import { ProgressBar } from 'primereact/progressbar';
import { Menu } from 'primereact/menu';
import { Dialog } from 'primereact/dialog';
import useAuth from '@/util/useAuth';
import { ContextMenu } from 'primereact/contextmenu';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar, setLayoutState } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const menuRight = useRef<any>(null);
    const [visible, setVisible] = useState(false);
    const { user } = useAuth();

    const onConfigButtonClick = () => {
        setLayoutState((prevState: LayoutState) => ({ ...prevState, configSidebarVisible: true }));
    };

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    let items = [
        {
            label: 'User',
            icon: 'pi pi-user',
            command: () => {
                setVisible(true);
            }
        },
        {
            label: 'Sign out',
            icon: 'pi pi-sign-out',
            command: async () => {
                await logout(); // Call login API function
                await router.push('/auth/login');
            }
        }
    ];
    const onProfileClick = (e: any) => {
        if (e) {
            menuRight.current?.toggle(e);
        }
    };

    return (
        <div className="layout-topbar">
            {isLoading && <ProgressBar mode="indeterminate" style={{ height: '6px', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1000 }} />}

            <Link href="/" className="layout-topbar-logo">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} alt="logo" />
                <span>Mezaluna</span>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <Menu model={items} popup ref={menuRight} id="popup_menu_right" popupAlignment="right" />
                <button type="button" className="p-link layout-topbar-button" onClick={onProfileClick} aria-controls="popup_menu_right" aria-haspopup>
                    <i className="pi pi-user"></i>
                    <span>Profile</span>
                </button>
                <button type="button" className="p-link layout-topbar-button" onClick={onConfigButtonClick}>
                    <i className="pi pi-cog"></i>
                    <span>Settings</span>
                </button>
            </div>
            <Dialog
                header="User"
                visible={visible}
                style={{ width: '50vw' }}
                onHide={() => {
                    if (!visible) return;
                    setVisible(false);
                }}
            >
                <p className="m-0">{user.email}</p>
            </Dialog>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
