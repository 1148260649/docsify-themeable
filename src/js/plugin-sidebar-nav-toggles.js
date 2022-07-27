// Plugin
// =============================================================================
// Add expand/collapse classes and behavior to sidebar navigation
export default function(hook, vm) {
    // const isEnabled = ((window.$docsify || {}).themeable || {}).responsiveTables !== false;

    // Add "expanded" class to all collapsed parents
    function expandSidebarNav(navElm) {
        const isAnchor      = /\?id/.test(navElm.getAttribute('href'));
        const sidebarNavElm = document.querySelector('.sidebar-nav');

        let elmParent = navElm.closest('li.parent');

        // Clear expanded items when loading new content
        if (!isAnchor) {
            const expandedElms = sidebarNavElm.querySelectorAll('.expanded');

            for (const elm of expandedElms) {
                elm.classList.remove('expanded');
            }
        }

        while (elmParent && elmParent !== sidebarNavElm) {
            elmParent.classList.add('expanded');
            elmParent = elmParent.closest('li:not(.expanded)');
        }
    }

    // Add classes to sidebar navigation items after each page load
    hook.doneEach(function () {
        const activeElm = document.querySelector('.sidebar-nav li.active');
        // const nestedNavElms = document.querySelectorAll('.sidebar-nav li ul:not(.app-sub-sidebar)');
        const nestedNavElms = document.querySelectorAll('.sidebar-nav li ul:not(.app-sub-sidebar), .sidebar-nav li a:not([href*="?id="])');

        for (const navElm of nestedNavElms) {
            navElm.closest('li').classList.add('parent');
        }

        if (activeElm) {
            expandSidebarNav(activeElm);
        }
    });

    // Toggle expanded class on sidebar navigation click
    hook.mounted(function () {
        const sidebarNavElm = document.querySelector('.sidebar-nav');

        if (sidebarNavElm) {
            sidebarNavElm.addEventListener('click', function (evt) {
                const navElm = evt.target.closest('li');
                const isParent = navElm && navElm.classList.contains('parent');
                const isExpanded = navElm.classList.contains('expanded');

                if (isParent && isExpanded) {
                    navElm.classList.remove('expanded');
                }
                else {
                    expandSidebarNav(evt.target);
                }
            });
        }
    });
}
