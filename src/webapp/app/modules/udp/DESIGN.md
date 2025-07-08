
## Page display

PageViewCtrl: various view modes like child page, full page, dialog. view = display + tools/buttons
PageDisplayCtrl: a component to render page content only

## Parameter

```
URL             openPageLink
 | pageId+query       | pageId+pageParams
 |____________________| 
           |
      [ui-router]           
           | resolve pageParams
     [PageViewCtrl]
           | pageParams+URL query -> $scope.pageParams
           |    
 [WidgetDirective/WidgetCtrl]
           |--------------------------------+----------------------------------+
           |                                |                                  |
           | $pageScope.pageParams          |                            [ParamWidget]
           | -> $scope.$widget.wParams      |                         
      [udp-input]----------------------[InputWidget]
           |                                | $watch change
           |                                |   set $pageScope.pageParams  
           |                                |    
           | $on PageParamChanged   <-------+   $broadcast PageParamChanged
           | -> model $widget.wParams[name]

 
```

${@.var.path}: @ indicates pageParams `var` is name of pageParams

${var.path}: path value of local params



```
Data Function Expression (fnExp)

URL query   pageParams
        ^
        |
--------|---------------------------------------
|       |                 +-------------+      |
|    pageParams <-------- | ParamWidget |      |
|       ^    ^            | InputWidget |      |
|       |    |            +-------------+      |
|    +--|----|----------------+                |
|    | (X)   wParams fnExp    |                |
|    |--|---------------------|                |
|    |  |-- widget data fnExp |                |
|    |                        |                | 
|    |[Widget]                |                |
|    +------------------------+                |
|[Page]                                        |
------------------------------------------------ 

(X) No access
    
```

`wParams` will automatically update its value from `InputWidget` with the same name





- Widget: `$widget`, widget parameters (dataset and job params) defined in `$widget.wParams[param_name]`
- Location query parameters
- `pageParams` initialized in state router, used for construction of child page URL

1. In state route, `pageParams` is initialized 
2. At begin of `PageViewCtrl`, passed in `pageParams` is merged with location query parameters `location.search` then assigned to page `$scope.pageParams`
3. [widget data load] `widget.directive` render widget with empty `wParams`
4. In `WidgetCtrl`, scope listens on `wParams` value change to reload widget data 
5. [wParams change, widget data load] In `WidgetCtrl`, page `$scope.pageParams` is assigned to widget `$scope.$widget.wParams`
6. In `WidgetCtrl`, `$widget.wParams` used to construct widget parameter `uinput.directive` controls with model name `$widget.wParams[param_name]`
7. [wParams change, widget data load] In `uinput.directive`, model values are parsed to their proper formats

So there are duplicate widget data load. Need refactor.

### Some naming

`$widget`

`$widget.$pageScope`

## Interaction

openPageLink
changePageParams

## Event handling

`widgetValues.events.PageParamChanged`  notify changes of page params 
This event is broadcast in pageScope || rootScope by:
- inputWidget when model change: broadcast, eventName defined in `eventbychange` 
- listWidget when click item

Listen on
uinputDirective: listen in scope (child of widget scope)
* model value - by uinput `name`
* select list - by props `eventtorefresh` 

### Events defined in widget uwProps

Naming conventions: `eventby` for event triggered, `event_to_` for event listened on.

- `eventbychange`: event triggered when model change
- `eventbyclick`: event triggered by button click
- `eventbytimer`: event triggered by timer interval
- `eventtorefresh`: event listened to refresh select list
- `dataset.eventtorefresh`: event listened to reload widget dataset

display

cardMode:
cardTheme:

backColor:
fontColor

# Widget common properties

````javascript
var props = {
    dataset:{
        id:'string'
    },
    fields:{
        field:'string',
        convertFn:'string'
    },
    display:{
        height: 0,  // in px
        width:  0,  // in %
        cardMode: {
        }
    }
}
````

# AngularJs Component and Directive
## NgModelController

There are two pipelines - $formatters and $parsers.  It looks like this:

$modelValue -> $formatters -> $viewValue -> $render

$modelValue <- $parsers <- $viewValue <- $setViewValue