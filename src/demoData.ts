export default {
    "blocksConfig": [
        {
            "type": "qualifio",
            "name": "Campaign",
            "category": "Engage",
            "thumbnail": "/bundles/ibexaadminuiassets/vendors/ids-assets/dist/img/all-icons.svg#speaker",
            "visible": false,
            "views": {
                "default": {
                    "name": "Default"
                }
            },
            "attributes": [
                {
                    "id": "campaign",
                    "name": "Campaign",
                    "type": "qualifiochannellist",
                    "value": null,
                    "constraints": {
                        "not_blank": {
                            "message": "Please select a Campaign"
                        }
                    }
                },
                {
                    "id": "width",
                    "name": "Width",
                    "type": "Ibexa\\ConnectorQualifio\\FieldTypePage\\Form\\Type\\HtmlElementSizeType",
                    "value": "",
                    "constraints": []
                },
                {
                    "id": "height",
                    "name": "Height",
                    "type": "Ibexa\\ConnectorQualifio\\FieldTypePage\\Form\\Type\\HtmlElementSizeType",
                    "value": "",
                    "constraints": []
                }
            ]
        },
        {
            "type": "orders",
            "name": "Orders",
            "category": "Commerce",
            "thumbnail": "/bundles/ibexaadminuiassets/vendors/ids-assets/dist/img/all-icons.svg#file-history",
            "visible": true,
            "views": {
                "default": {
                    "name": "Default block layout"
                }
            },
            "attributes": [
                {
                    "id": "columns",
                    "name": "Columns",
                    "type": "select",
                    "value": "id,user_name,total_value,created_at",
                    "constraints": []
                },
                {
                    "id": "statuses",
                    "name": "Statuses",
                    "type": "select",
                    "value": "all",
                    "constraints": {
                        "not_blank": {
                            "message": "Statuses cannot be empty."
                        }
                    }
                },
                {
                    "id": "limit",
                    "name": "Number of orders",
                    "type": "integer",
                    "value": 10,
                    "constraints": {
                        "not_blank": {
                            "message": "Number of orders cannot be empty."
                        },
                        "regexp": {
                            "options": {
                                "pattern": "/[0-9]+/"
                            },
                            "message": "Limit must be a number"
                        }
                    }
                },
                {
                    "id": "sorting",
                    "name": "Sort order",
                    "type": "select",
                    "value": "created_desc",
                    "constraints": []
                }
            ]
        },
        {
            "type": "sales_rep",
            "name": "Sales Representative",
            "category": "Customer Portal",
            "thumbnail": "/bundles/ibexaadminuiassets/vendors/ids-assets/dist/img/all-icons.svg#user-money",
            "visible": true,
            "views": {
                "default": {
                    "name": "Default block layout"
                }
            },
            "attributes": []
        },
        {
            "type": "targeting",
            "name": "Targeting",
            "category": "default",
            "thumbnail": "/bundles/ibexaadminuiassets/vendors/ids-assets/dist/img/all-icons.svg#user-profile",
            "visible": true,
            "views": {
                "default": {
                    "name": "Default block layout"
                }
            },
            "attributes": [
                {
                    "id": "default_content_id",
                    "name": "Select default content",
                    "type": "embed",
                    "value": null,
                    "constraints": {
                        "not_blank": {
                            "message": "You must provide value"
                        },
                        "regexp": {
                            "options": {
                                "pattern": "/[0-9]+/"
                            },
                            "message": "Choose a Content item"
                        }
                    }
                },
                {
                    "id": "content_map",
                    "name": "Setup segment and content matching priority rules",
                    "type": "segment_content_map",
                    "value": null,
                    "constraints": {
                        "not_blank": {
                            "message": "You must provide value"
                        },
                        "regexp": {
                            "options": {
                                "pattern": "/[0-9]+/"
                            },
                            "message": "Choose a Content item"
                        }
                    }
                }
            ]
        },
        {
            "type": "form",
            "name": "Form",
            "category": "default",
            "thumbnail": "/bundles/ibexaformbuilder/images/thumbnails/form.svg#form",
            "visible": true,
            "views": {
                "default": {
                    "name": "Default block layout"
                }
            },
            "attributes": [
                {
                    "id": "contentId",
                    "name": "Form",
                    "type": "embedform",
                    "value": null,
                    "constraints": {
                        "not_blank": {
                            "message": "You must select a form"
                        },
                        "regexp": {
                            "options": {
                                "pattern": "/[0-9]+/"
                            },
                            "message": "Choose a form"
                        },
                        "content_type": {
                            "message": "You must select a Form",
                            "options": {
                                "types": "form"
                            }
                        }
                    }
                }
            ]
        },
        {
            "type": "tag",
            "name": "Code",
            "category": "default",
            "thumbnail": "/bundles/ibexaadminuiassets/vendors/ids-assets/dist/img/all-icons.svg#text-code",
            "visible": true,
            "views": {
                "default": {
                    "name": "Default block layout"
                }
            },
            "attributes": [
                {
                    "id": "content",
                    "name": "Content",
                    "type": "text",
                    "value": null,
                    "constraints": {
                        "not_blank": {
                            "message": "You must provide Content of Code block"
                        },
                        "regexp": {
                            "options": {
                                "pattern": "/[^\\\\s]/"
                            },
                            "message": "Only valid HTML code is allowed"
                        }
                    }
                }
            ]
        },
        {
            "type": "contentlist",
            "name": "Content List",
            "category": "default",
            "thumbnail": "/bundles/ibexaadminuiassets/vendors/ids-assets/dist/img/all-icons.svg#list-content",
            "visible": true,
            "views": {
                "default": {
                    "name": "Default block layout"
                }
            },
            "attributes": [
                {
                    "id": "contentId",
                    "name": "Parent",
                    "type": "embed",
                    "value": null,
                    "constraints": {
                        "not_blank": {
                            "message": "You must provide value"
                        },
                        "regexp": {
                            "options": {
                                "pattern": "/[0-9]+/"
                            },
                            "message": "Choose a Content item"
                        }
                    }
                },
                {
                    "id": "limit",
                    "name": "Limit",
                    "type": "integer",
                    "value": null,
                    "constraints": {
                        "not_blank": {
                            "message": "You must provide value"
                        },
                        "regexp": {
                            "options": {
                                "pattern": "/^[1-9][0-9]*$/"
                            },
                            "message": "Limit must be a number greater than 0"
                        }
                    }
                },
                {
                    "id": "contentType",
                    "name": "Content types to be displayed",
                    "type": "contenttypelist",
                    "value": null,
                    "constraints": {
                        "not_blank": {
                            "message": "You must provide value"
                        },
                        "regexp": {
                            "options": {
                                "pattern": "/^([a-zA-Z_-]+|,[a-zA-Z_-]+)+$/i"
                            },
                            "message": "Choose at least one content type"
                        }
                    }
                }
            ]
        },
        {
            "type": "banner",
            "name": "Banner",
            "category": "default",
            "thumbnail": "/bundles/ibexaadminuiassets/vendors/ids-assets/dist/img/all-icons.svg#banner",
            "visible": true,
            "views": {
                "default": {
                    "name": "Default block layout"
                }
            },
            "attributes": [
                {
                    "id": "contentId",
                    "name": "Image",
                    "type": "embed",
                    "value": null,
                    "constraints": {
                        "content_type": {
                            "message": "You must select an Image",
                            "options": {
                                "types": "image"
                            }
                        },
                        "not_blank": {
                            "message": "You must provide value"
                        },
                        "regexp": {
                            "options": {
                                "pattern": "/[0-9]+/"
                            },
                            "message": "Choose a Content item"
                        }
                    }
                },
                {
                    "id": "url",
                    "name": "URL",
                    "type": "string",
                    "value": "http://",
                    "constraints": {
                        "not_blank": {
                            "message": "You must provide value"
                        },
                        "regexp": {
                            "options": {
                                "pattern": "/^(https?|ftp):\\/\\/[^\\s\\/$.?#].[^\\s]*$/"
                            },
                            "message": "Provide a URL"
                        }
                    }
                }
            ]
        },
        {
            "type": "collection",
            "name": "Collection",
            "category": "default",
            "thumbnail": "/bundles/ibexaadminuiassets/vendors/ids-assets/dist/img/all-icons.svg#collection",
            "visible": true,
            "views": {
                "default": {
                    "name": "Default block layout"
                }
            },
            "attributes": [
                {
                    "id": "locationlist",
                    "name": "Location list",
                    "type": "locationlist",
                    "value": null,
                    "constraints": {
                        "not_blank": {
                            "message": "Choose location items"
                        }
                    }
                }
            ]
        },
        {
            "type": "embed",
            "name": "Embed",
            "category": "default",
            "thumbnail": "/bundles/ibexaadminuiassets/vendors/ids-assets/dist/img/all-icons.svg#text-embedded",
            "visible": true,
            "views": {
                "default": {
                    "name": "Default block layout"
                }
            },
            "attributes": [
                {
                    "id": "contentId",
                    "name": "Content",
                    "type": "embed",
                    "value": null,
                    "constraints": {
                        "not_blank": {
                            "message": "You must provide value"
                        },
                        "regexp": {
                            "options": {
                                "pattern": "/[0-9]+/"
                            },
                            "message": "Choose a Content item"
                        }
                    }
                }
            ]
        },
        {
            "type": "gallery",
            "name": "Gallery",
            "category": "default",
            "thumbnail": "/bundles/ibexaadminuiassets/vendors/ids-assets/dist/img/all-icons.svg#image-gallery",
            "visible": true,
            "views": {
                "default": {
                    "name": "Default block layout"
                }
            },
            "attributes": [
                {
                    "id": "contentId",
                    "name": "Folder",
                    "type": "embed",
                    "value": null,
                    "constraints": {
                        "not_blank": {
                            "message": "You must provide value"
                        },
                        "regexp": {
                            "options": {
                                "pattern": "/[0-9]+/"
                            },
                            "message": "Choose an image folder"
                        },
                        "content_container": {
                            "message": "You must select a container"
                        }
                    }
                }
            ]
        },
        {
            "type": "video",
            "name": "Video",
            "category": "default",
            "thumbnail": "/bundles/ibexaadminuiassets/vendors/ids-assets/dist/img/all-icons.svg#video-play",
            "visible": true,
            "views": {
                "default": {
                    "name": "Default block layout"
                }
            },
            "attributes": [
                {
                    "id": "contentId",
                    "name": "Video",
                    "type": "embedvideo",
                    "value": null,
                    "constraints": {
                        "not_blank": {
                            "message": "You must provide value"
                        },
                        "regexp": {
                            "options": {
                                "pattern": "/[0-9]+/"
                            },
                            "message": "Choose a video Content item"
                        }
                    }
                }
            ]
        },
        {
            "type": "rss",
            "name": "RSS",
            "category": "default",
            "thumbnail": "/bundles/ibexaadminuiassets/vendors/ids-assets/dist/img/all-icons.svg#signal-rss",
            "visible": true,
            "views": {
                "default": {
                    "name": "Default block layout"
                }
            },
            "attributes": [
                {
                    "id": "url",
                    "name": "URL",
                    "type": "string",
                    "value": "http://",
                    "constraints": {
                        "not_blank": {
                            "message": "You must provide value"
                        },
                        "regexp": {
                            "options": {
                                "pattern": "/^(https?|ftp):\\/\\/[^\\s\\/$.?#].[^\\s]*$/"
                            },
                            "message": "Provide a feed url"
                        }
                    }
                },
                {
                    "id": "limit",
                    "name": "Limit",
                    "type": "integer",
                    "value": 10,
                    "constraints": {
                        "regexp": {
                            "options": {
                                "pattern": "/[0-9]+/"
                            },
                            "message": "Limit must be a number"
                        }
                    }
                },
                {
                    "id": "offset",
                    "name": "Offset",
                    "type": "integer",
                    "value": 0,
                    "constraints": {
                        "regexp": {
                            "options": {
                                "pattern": "/[0-9]+/"
                            },
                            "message": "Offset must be a number"
                        }
                    }
                }
            ]
        },
        {
            "type": "schedule",
            "name": "Content Scheduler",
            "category": "default",
            "thumbnail": "/bundles/ibexaadminuiassets/vendors/ids-assets/dist/img/all-icons.svg#calendar-schedule",
            "visible": true,
            "views": {
                "default": {
                    "name": "Default block layout"
                }
            },
            "attributes": [
                {
                    "id": "limit",
                    "name": "Limit",
                    "type": "integer",
                    "value": 10,
                    "constraints": {
                        "regexp": {
                            "options": {
                                "pattern": "/[0-9]+/"
                            },
                            "message": "Limit must be a number"
                        }
                    }
                },
                {
                    "id": "events",
                    "name": "Events",
                    "type": "schedule_events",
                    "value": "[]",
                    "constraints": []
                },
                {
                    "id": "snapshots",
                    "name": "Snapshots",
                    "type": "schedule_snapshots",
                    "value": "[]",
                    "constraints": []
                },
                {
                    "id": "initial_items",
                    "name": "Initial Items",
                    "type": "schedule_initial_items",
                    "value": "[]",
                    "constraints": []
                },
                {
                    "id": "slots",
                    "name": "Slots",
                    "type": "schedule_slots",
                    "value": "[]",
                    "constraints": []
                },
                {
                    "id": "loaded_snapshot",
                    "name": "Loaded Snapshot",
                    "type": "schedule_loaded_snapshot",
                    "value": "",
                    "constraints": []
                }
            ]
        },
        {
            "type": "richtext",
            "name": "Text",
            "category": "default",
            "thumbnail": "/bundles/ibexaadminuiassets/vendors/ids-assets/dist/img/all-icons.svg#text-paragraph",
            "visible": true,
            "views": {
                "default": {
                    "name": "Default view"
                }
            },
            "attributes": [
                {
                    "id": "content",
                    "name": "Content",
                    "type": "richtext",
                    "value": null,
                    "constraints": []
                }
            ]
        },
        {
            "type": "catalog",
            "name": "Catalog",
            "category": "PIM",
            "thumbnail": "/bundles/ibexaadminuiassets/vendors/ids-assets/dist/img/all-icons.svg#catalog",
            "visible": true,
            "views": {
                "default": {
                    "name": "Default block layout"
                }
            },
            "attributes": [
                {
                    "id": "default_catalog",
                    "name": "Default catalog",
                    "type": "catalog_list",
                    "value": null,
                    "constraints": {
                        "not_blank": {
                            "message": "Default catalog cannot be empty"
                        }
                    }
                },
                {
                    "id": "catalog_map",
                    "name": "Set up customer group and catalog",
                    "type": "targeted_catalog_customer_group_map_attribute",
                    "value": null,
                    "constraints": []
                },
                {
                    "id": "limit",
                    "name": "Display limit",
                    "type": "integer",
                    "value": 10,
                    "constraints": {
                        "not_blank": {
                            "message": "Number of Items must be set"
                        },
                        "regexp": {
                            "options": {
                                "pattern": "/[0-9]+/"
                            },
                            "message": "Number of Items must be an integer"
                        }
                    }
                }
            ]
        },
        {
            "type": "product_collection",
            "name": "Product collection",
            "category": "PIM",
            "thumbnail": "/bundles/ibexaadminuiassets/vendors/ids-assets/dist/img/all-icons.svg#collection",
            "visible": true,
            "views": {
                "default": {
                    "name": "Default block layout"
                }
            },
            "attributes": [
                {
                    "id": "products",
                    "name": "Product list",
                    "type": "product_list",
                    "value": null,
                    "constraints": {
                        "not_blank": {
                            "message": "Product list cannot be empty"
                        }
                    }
                }
            ]
        },
        {
            "type": "product_embed",
            "name": "Product embed",
            "category": "PIM",
            "thumbnail": "/bundles/ibexaadminuiassets/vendors/ids-assets/dist/img/all-icons.svg#product",
            "visible": true,
            "views": {
                "default": {
                    "name": "Default block layout"
                }
            },
            "attributes": [
                {
                    "id": "product",
                    "name": "Product",
                    "type": "product_embed",
                    "value": null,
                    "constraints": {
                        "not_blank": {
                            "message": "Product cannot be empty"
                        }
                    }
                }
            ]
        },
        {
            "type": "personalized",
            "name": "Personalized",
            "category": "default",
            "thumbnail": "/bundles/ibexaadminuiassets/vendors/ids-assets/dist/img/all-icons.svg#file-settings",
            "visible": false,
            "views": {
                "default": {
                    "name": "Default block layout"
                }
            },
            "attributes": [
                {
                    "id": "scenario",
                    "name": "Select a scenario",
                    "type": "personalization_scenario_list",
                    "value": null,
                    "constraints": {
                        "not_blank": {
                            "message": "Scenario must be set"
                        }
                    }
                },
                {
                    "id": "output",
                    "name": "Select a content type to be displayed",
                    "type": "personalization_output_type_list",
                    "value": null,
                    "constraints": []
                },
                {
                    "id": "number",
                    "name": "Display limit",
                    "type": "integer",
                    "value": 10,
                    "constraints": {
                        "not_blank": {
                            "message": "Number of Items must be set"
                        },
                        "regexp": {
                            "options": {
                                "pattern": "/[0-9]+/"
                            },
                            "message": "Number of Items must be an integer"
                        }
                    }
                }
            ]
        },
        {
            "type": "dynamic_targeting",
            "name": "Dynamic targeting",
            "category": "default",
            "thumbnail": "/bundles/ibexaadminuiassets/vendors/ids-assets/dist/img/all-icons.svg#user-profile",
            "visible": false,
            "views": {
                "default": {
                    "name": "Default block layout"
                }
            },
            "attributes": [
                {
                    "id": "default_scenario",
                    "name": "Select default scenario",
                    "type": "personalization_scenario_list",
                    "value": null,
                    "constraints": {
                        "not_blank": {
                            "message": "Scenario must be set"
                        }
                    }
                },
                {
                    "id": "default_output",
                    "name": "Select default content type to be displayed",
                    "type": "personalization_output_type_list",
                    "value": null,
                    "constraints": []
                },
                {
                    "id": "limit",
                    "name": "Display limit",
                    "type": "integer",
                    "value": 10,
                    "constraints": {
                        "not_blank": {
                            "message": "Number of Items must be set"
                        },
                        "regexp": {
                            "options": {
                                "pattern": "/[0-9]+/"
                            },
                            "message": "Number of Items must be an integer"
                        }
                    }
                },
                {
                    "id": "scenario_map",
                    "name": "Setup segment and scenario matching priority rules",
                    "type": "personalization_segment_scenario_map",
                    "value": null,
                    "constraints": {
                        "not_blank": {
                            "message": "You must provide value"
                        }
                    }
                }
            ]
        },
        {
            "type": "last_viewed",
            "name": "Last viewed",
            "category": "PIM",
            "thumbnail": "/bundles/ibexaadminuiassets/vendors/ids-assets/dist/img/all-icons.svg#app-recent",
            "visible": false,
            "views": {
                "default": {
                    "name": "Default block layout"
                }
            },
            "attributes": [
                {
                    "id": "scenario",
                    "name": "Personalization Scenario",
                    "type": "personalization_scenario_list",
                    "value": null,
                    "constraints": {
                        "not_blank": {
                            "message": "Scenario must be set"
                        }
                    }
                },
                {
                    "id": "product_types",
                    "name": "Product Types to be displayed",
                    "type": "personalization_output_type_list",
                    "value": null,
                    "constraints": []
                },
                {
                    "id": "limit",
                    "name": "Limit",
                    "type": "integer",
                    "value": 10,
                    "constraints": {
                        "not_blank": {
                            "message": "Number of Items must be set"
                        },
                        "regexp": {
                            "options": {
                                "pattern": "/^[0-9]+$/"
                            },
                            "message": "Number of Items must be an integer"
                        }
                    }
                }
            ]
        },
        {
            "type": "last_purchased",
            "name": "Last purchased",
            "category": "PIM",
            "thumbnail": "/bundles/ibexaadminuiassets/vendors/ids-assets/dist/img/all-icons.svg#cursor-clicked-hand",
            "visible": false,
            "views": {
                "default": {
                    "name": "Default block layout"
                }
            },
            "attributes": [
                {
                    "id": "scenario",
                    "name": "Personalization Scenario",
                    "type": "personalization_scenario_list",
                    "value": null,
                    "constraints": {
                        "not_blank": {
                            "message": "Scenario must be set"
                        }
                    }
                },
                {
                    "id": "product_types",
                    "name": "Product Types to be displayed",
                    "type": "personalization_output_type_list",
                    "value": null,
                    "constraints": []
                },
                {
                    "id": "limit",
                    "name": "Limit",
                    "type": "integer",
                    "value": 10,
                    "constraints": {
                        "not_blank": {
                            "message": "Number of Items must be set"
                        },
                        "regexp": {
                            "options": {
                                "pattern": "/[0-9]+/"
                            },
                            "message": "Number of Items must be an integer"
                        }
                    }
                }
            ]
        },
        {
            "type": "bestsellers",
            "name": "Bestsellers",
            "category": "Commerce",
            "thumbnail": "/bundles/ibexaadminuiassets/vendors/ids-assets/dist/img/all-icons.svg#badge-star",
            "visible": false,
            "views": {
                "default": {
                    "name": "Default block layout"
                }
            },
            "attributes": [
                {
                    "id": "scenario",
                    "name": "Personalization Scenario",
                    "type": "personalization_scenario_list",
                    "value": null,
                    "constraints": {
                        "not_blank": {
                            "message": "Scenario must be set"
                        }
                    }
                },
                {
                    "id": "product_types",
                    "name": "Product Types to be displayed",
                    "type": "personalization_output_type_list",
                    "value": null,
                    "constraints": []
                },
                {
                    "id": "limit",
                    "name": "Limit",
                    "type": "integer",
                    "value": 10,
                    "constraints": {
                        "not_blank": {
                            "message": "Number of Items must be set"
                        },
                        "regexp": {
                            "options": {
                                "pattern": "/[0-9]+/"
                            },
                            "message": "Number of Items must be an integer"
                        }
                    }
                }
            ]
        },
        {
            "type": "recently_added",
            "name": "Recently added",
            "category": "PIM",
            "thumbnail": "/bundles/ibexaadminuiassets/vendors/ids-assets/dist/img/all-icons.svg#history",
            "visible": false,
            "views": {
                "default": {
                    "name": "Default block layout"
                }
            },
            "attributes": [
                {
                    "id": "scenario",
                    "name": "Personalization Scenario",
                    "type": "personalization_scenario_list",
                    "value": null,
                    "constraints": {
                        "not_blank": {
                            "message": "Scenario must be set"
                        }
                    }
                },
                {
                    "id": "product_types",
                    "name": "Product Types to be displayed",
                    "type": "personalization_output_type_list",
                    "value": null,
                    "constraints": []
                },
                {
                    "id": "limit",
                    "name": "Limit",
                    "type": "integer",
                    "value": 10,
                    "constraints": {
                        "not_blank": {
                            "message": "Number of items must be set"
                        },
                        "regexp": {
                            "options": {
                                "pattern": "/^[0-9]+$/"
                            },
                            "message": "Number of items must be an integer"
                        }
                    }
                }
            ]
        },
        {
            "type": "ibexa_connect_block",
            "name": "Ibexa Connect",
            "category": "default",
            "thumbnail": "/bundles/ibexaadminuiassets/vendors/ids-assets/dist/img/all-icons.svg#connection",
            "visible": false,
            "views": [],
            "attributes": [
                {
                    "id": "url",
                    "name": "Webhook link",
                    "type": "url",
                    "value": null,
                    "constraints": {
                        "not_blank": {
                            "message": "You must provide value"
                        },
                        "url": []
                    }
                },
                {
                    "id": "send_customer_group_identifier",
                    "name": "Send Customer Group identifier",
                    "type": "checkbox",
                    "value": null,
                    "constraints": []
                },
                {
                    "id": "send_user_id",
                    "name": "Send User ID",
                    "type": "checkbox",
                    "value": null,
                    "constraints": []
                }
            ]
        }
    ],
    "blocksIdMap": new Map([
        ["3184", "Text #1"],
        ["3185", "Text #2"],
        ["3186", "Code #1"],
        ["3187", "Text #3"],
    ]),
    "fieldValue": {
        "layout": "default",
        "zones": [
            {
                "id": "1493",
                "name": "default",
                "blocks": [
                    {
                        "visible": true,
                        "id": "3184",
                        "type": "richtext",
                        "name": "Text",
                        "view": "default",
                        "class": null,
                        "style": null,
                        "compiled": "",
                        "since": null,
                        "till": null,
                        "attributes": [
                            {
                                "id": "3167",
                                "name": "content",
                                "value": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<section xmlns=\"http://docbook.org/ns/docbook\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:ezxhtml=\"http://ibexa.co/xmlns/dxp/docbook/xhtml\" xmlns:ezcustom=\"http://ibexa.co/xmlns/dxp/docbook/custom\" version=\"5.0-variant ezpublish-1.0\"><para><link xlink:href=\"mailto:ibexa@ibexa.co\" xlink:show=\"none\" xlink:title=\"\">zzzzzz</link></para></section>\n"
                            }
                        ]
                    },
                    {
                        "visible": true,
                        "id": "3185",
                        "type": "richtext",
                        "name": "Text",
                        "view": "default",
                        "class": null,
                        "style": null,
                        "compiled": "",
                        "since": null,
                        "till": null,
                        "attributes": [
                            {
                                "id": "3168",
                                "name": "content",
                                "value": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<section xmlns=\"http://docbook.org/ns/docbook\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:ezxhtml=\"http://ibexa.co/xmlns/dxp/docbook/xhtml\" xmlns:ezcustom=\"http://ibexa.co/xmlns/dxp/docbook/custom\" version=\"5.0-variant ezpublish-1.0\"><para><link xlink:href=\"mailto:ibexa@ibexa.co\" xlink:show=\"none\" xlink:title=\"\">zzzzzz</link></para></section>\n"
                            }
                        ]
                    },
                    {
                        "visible": true,
                        "id": "3186",
                        "type": "tag",
                        "name": "Code",
                        "view": "default",
                        "class": null,
                        "style": null,
                        "compiled": "",
                        "since": null,
                        "till": null,
                        "attributes": [
                            {
                                "id": "3169",
                                "name": "content",
                                "value": "asd"
                            }
                        ]
                    },
                    {
                        "visible": true,
                        "id": "3187",
                        "type": "richtext",
                        "name": "Text",
                        "view": "default",
                        "class": null,
                        "style": null,
                        "compiled": "",
                        "since": null,
                        "till": null,
                        "attributes": [
                            {
                                "id": "3170",
                                "name": "content",
                                "value": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<section xmlns=\"http://docbook.org/ns/docbook\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:ezxhtml=\"http://ibexa.co/xmlns/dxp/docbook/xhtml\" xmlns:ezcustom=\"http://ibexa.co/xmlns/dxp/docbook/custom\" version=\"5.0-variant ezpublish-1.0\"><para><link xlink:href=\"mailto:ibexa@ibexa.co\" xlink:show=\"none\" xlink:title=\"\">zzzzzz</link></para></section>\n"
                            }
                        ]
                    }
                ]
            }
        ]
    }
}