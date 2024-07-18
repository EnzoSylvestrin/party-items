import clsx from "clsx";
import { IconType } from "react-icons/lib"

type IconProps = {
    icon: IconType,
    size?: string | number,
    colored?: boolean,
    className?: string,
    useDarkMode?: boolean,
}

export const Icon = ({ icon: IconComponent, size = 28, colored, className, useDarkMode = true }: IconProps) => {
    return (
        <IconComponent
            className={clsx(
                colored
                    ? 'text-secondary fill-secondary'
                    : `text-darkColor fill-darkColor ${useDarkMode ? 'dark:text-lightColor dark:fill-lightColor' : ''}`,
                className
            )}
            size={size}
        />
    );
}