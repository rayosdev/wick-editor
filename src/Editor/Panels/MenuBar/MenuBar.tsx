import { FC, ReactNode } from 'react';
import './_menubar.scss';
import MenuBarButton from './MenuBarButton/MenuBarButton';
import MenuBarIconButton from './MenuBarIconButton/MenuBarIconButton';
import MenuBarSupportButton from './MenuBarSupportButton/MenuBarSupportButton';
import type { ToastType, ToastOptions } from 'Editor/types';

export type MenuBarSize = 'large' | 'medium' | 'small';

export interface MenuBarProps {
    renderSize: MenuBarSize;
    projectName: string;
    exporting: boolean;
    openModal: (modalName: string, options?: Record<string, unknown>) => void;
    openNewProjectConfirmation: () => void;
    openProjectFileDialog: () => void;
    exportProjectAsWickFile: () => void;
    openExportMedia: () => void;
    openExportOptions: () => void;
    importProjectAsWickFile?: () => void;
    toast?: (message: string, type?: ToastType, options?: ToastOptions) => void;
}

const MenuBar: FC<MenuBarProps> = ({
    renderSize,
    projectName,
    exporting,
    openModal,
    openNewProjectConfirmation,
    openProjectFileDialog,
    exportProjectAsWickFile,
    openExportMedia,
    openExportOptions,
}) => {
    const handleExportClick = (): void => {
        if (exporting) {
            openExportMedia();
        } else {
            openExportOptions();
        }
    };

    const renderDesktop = (): ReactNode => (
        <div className="docked-pane menu-bar" aria-label="Menu Bar">
            <div className="menu-bar-info-container">
                <MenuBarIconButton
                    id="tool-information-button"
                    tooltip="Editor Information"
                    action={() => openModal('EditorInfo')}
                    icon="mascotmark"
                />

                <MenuBarSupportButton
                    icon="redheart"
                    text="support us"
                    id="support-us-button"
                    action={() => openModal('SupportUs')}
                />
            </div>

            <div
                className="menu-bar-project-name"
                role="button"
                onClick={() => openModal('SimpleProjectSettings')}
            >
                {projectName}
            </div>

            <div className="menu-bar-actions-container">
                <MenuBarButton text="new" action={openNewProjectConfirmation} />

                <MenuBarButton text="open" action={openProjectFileDialog} />

                <MenuBarButton text="export" action={handleExportClick} />

                <MenuBarButton
                    text="save"
                    action={exportProjectAsWickFile}
                    color="save"
                />

                <MenuBarIconButton
                    icon="gear"
                    action={() => openModal('SettingsModal')}
                    tooltip="Editor Settings"
                    tooltipPlace="left"
                    id="editor-settings-button"
                />
            </div>
        </div>
    );

    const renderMobile = (): ReactNode => (
        <div className="docked-pane menu-bar">
            <MenuBarIconButton
                icon="hamburger"
                action={() => openModal('MobileMenuModal')}
            />

            <MenuBarSupportButton
                icon="redheart"
                id="support-us-button"
                action={() => openModal('SupportUs')}
            />

            <div
                role="button"
                onClick={() => openModal('SimpleProjectSettings')}
                className="menu-bar-project-name-mobile"
            >
                {projectName}
            </div>

            <div className="menu-bar-actions-container">
                <MenuBarButton
                    text="save"
                    action={exportProjectAsWickFile}
                    color="save"
                />
            </div>
        </div>
    );

    return renderSize === 'small' ? renderMobile() : renderDesktop();
};

export default MenuBar;
