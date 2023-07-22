const resolver = raw => (raw instanceof Object) ? Object.assign({
    path: raw.name,
    variables: raw.variables,
    constants: {
        title: raw.name,
        directive: raw.name
    },
    modules: raw.name
}, raw) : {
    path: raw,
    constants: {
        title: raw,
        directive: raw
    },
    modules: raw
};

return {
    mode: 'history',
    prefix: 'prefix',
    aliases: {
        '': 'index1',
        'index': 'index1',
        'demo_local.html': 'index2'
    },
    default: '',
    routing: { // path/constants/variables/tailable/modules/children,
        tailable: false,
        constants: {
            title: 'default, should be overwritten'
        },
        modules: ['modules', 'root_style', 'test_script', 'script', 'component', 'prefix', 'suffix'],
        children: [{
            path: '401',
            modules: 'm401'
        }, {
            path: '404',
            modules: 'm404'
        }, {
            path: 'newpage',
            modules: 'newpage',
            redirect: ({ item }) => item > 123 ? 0 : 404
        }, {
            path: 'index1',
            constants: {
                title: 'index',
                template: 'index'
            },
            modules: 'index'
        }, {
            path: 'controllers',
            constants: {
                title: 'controllers',
                template: 'controllers'
            },
            modules: 'controllers',
            children: [{
                name: 'focus',
                variables: {
                    focus: false
                }
            }, {
                name: 'boolean',
                variables: {
                    boolean: false
                }
            }, 'class', {
                name: 'style',
                constants: {
                    title: 'style',
                    directive: 'styl__e'
                },
                modules: 'stylE'
            }, 'raw', {
                name: 'general',
                variables: {
                    index: 0
                }
            }, {
                name: 'text',
                variables: {
                    index: 0
                },
            }, {
                name: 'lifeCycle',
                constants: {
                    title: 'lifeCycle',
                    directive: 'life__Cycle'
                },
            }, {
                name: 'html',
                constants: {
                    title: 'html',
                    directive: 'html_'
                },
                modules: 'html_'
            }, 'file', 'exist', 'each', 'value', 'checked', 'selected', 'modules', {
                name: 'href',
                modules: ['href', 'module_component']
            }, {
                name: 'iframe',
                constants: {
                    title: 'iframe',
                    directive: 'iframe_'
                },
                modules: 'iframe_'
            }, {
                name: 'template',
                constants: {
                    title: 'template',
                    directive: 'view_'
                },
                modules: 'view_'
            }, {
                name: 'eventHandler',
                constants: {
                    title: 'eventHandler',
                    directive: 'event__Handler'
                },
                modules: 'eventHandler'
            }, 'date', {
                name: 'custom',
                constants: {
                    title: 'custom class',
                    directive: 'custom'
                },
            }, 'watch'].map(resolver)
        }]
    }
};
