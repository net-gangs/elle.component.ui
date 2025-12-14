import type { NavItemType } from "@/types/menu";
import { preparationNavItems } from "./preparation";
import { toolNavItems } from "./tool";
import { settingsNavItems } from "./example-settings";
import { exampleNestedNavItems } from "./example-nested";

const rootNavItems: NavItemType[] = [
    preparationNavItems,
    toolNavItems,
    settingsNavItems,
    exampleNestedNavItems
];

export default rootNavItems;