import type { NavItemType } from "@/types/menu";
import { preparationNavItems } from "./preparation";
import { toolNavItems } from "./tool";

const rootNavItems: NavItemType[] = [
    preparationNavItems,
    toolNavItems
];

export default rootNavItems;