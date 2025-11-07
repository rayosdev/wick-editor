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

                {/* Debug: Cache Save/Load buttons for IndexedDB/localStorage */}
                <MenuBarButton
                    text="cache save"
                    action={() => {
                        try {
                            const w: any = window as any;
                            const project = (w.editor && w.editor.project) || (w.project);
                            if (!project || !w.Wick || !w.Wick.WickFile) {
                                (typeof alert === 'function' ? alert : console.error)('Cannot access project or Wick engine.');
                                return;
                            }
                            // Export current project to wick JSON string via WickFile.toWickFile
                            w.Wick.WickFile.toWickFile(project, (blob: Blob | string) => {
                                const handleString = (str: string) => {
                                    if (w.__wickDebug && w.__wickDebug.saveToIndexedDB) {
                                        w.__wickDebug.saveToIndexedDB(str, 'wick_cached_project');
                                    } else if (w.__wickDebug && w.__wickDebug.saveToCache) {
                                        w.__wickDebug.saveToCache(str, 'wick_cached_project');
                                    } else {
                                        localStorage.setItem('wick_cached_project', str);
                                    }
                                };
                                if (typeof blob === 'string') {
                                    handleString(blob);
                                } else {
                                    const fr = new FileReader();
                                    fr.onload = () => handleString(String(fr.result));
                                    fr.readAsText(blob);
                                }
                            }, 'blob');
                        } catch (e) {
                            console.error('[ProjectLoad] menu:cacheSave:error', e);
                        }
                    }}
                />

                <MenuBarButton
                    text="cache load"
                    action={() => {
                        try {
                            const w: any = window as any;
                            if (w.__wickDebug && w.__wickDebug.loadFromIndexedDB) {
                                w.__wickDebug.loadFromIndexedDB('wick_cached_project', (success: boolean) => {
                                    console.debug('[ProjectLoad] menu:indexeddb:load', { success });
                                });
                            } else if (w.__wickDebug && w.__wickDebug.loadFromCache) {
                                w.__wickDebug.loadFromCache('wick_cached_project', (success: boolean) => {
                                    console.debug('[ProjectLoad] menu:localStorage:load', { success });
                                });
                            } else {
                                // Minimal fallback: read from localStorage and load
                                const cached = localStorage.getItem('wick_cached_project');
                                if (!cached) {
                                    console.error('[ProjectLoad] menu:cache:missing');
                                    return;
                                }
                                const blob = new Blob([cached], { type: 'application/json' });
                                w.Wick.WickFile.fromWickFile(blob, (result: any) => {
                                    if (result && w.editor && w.editor.setupNewProject) {
                                        w.editor.setupNewProject(result);
                                    }
                                });
                            }
                        } catch (e) {
                            console.error('[ProjectLoad] menu:cacheLoad:error', e);
                        }
                    }}
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
