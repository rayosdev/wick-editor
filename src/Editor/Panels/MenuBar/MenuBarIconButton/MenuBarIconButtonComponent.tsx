import { FC, MouseEvent } from 'react';
import './_menubariconbutton.scss';
import ActionButton from 'Editor/Util/ActionButton/ActionButton';

export type MenuBarIconButtonProps = {
  id?: string;
  tooltip?: string;
  tooltipPlace?: 'top' | 'bottom' | 'left' | 'right';
  action: (event?: MouseEvent) => void;
  icon: string;
};

const MenuBarIconButton: FC<MenuBarIconButtonProps> = ({
  id,
  tooltip,
  tooltipPlace = 'bottom',
  action,
  icon,
}) => {
  return (
    <div className="menu-bar-icon-button">
      <ActionButton
        color="menu"
        id={id}
        tooltip={tooltip}
        tooltipPlace={tooltipPlace}
        action={action}
        icon={icon}
      />
    </div>
  );
};

export default MenuBarIconButton;

