Bearings.js
===========

A Bootstrapped jQuery plugin for breadcrumb navigation

## Examples

Initialisation

```javascript
$('#breadcrumb').bearings({
    items: [{displayName: 'One'}, {displayName: 'Two'}, {displayName: 'Three'}],
});
```

Binding to events

```javascript
$('#breadcrumb').on('bearings.itemSelected', function(e, data){
	// do some magic with the selected item
});
```

Update the collection

```javascript
$('#breadcrumb').bearings('updateList', [{displayName:'new item'}] );
```

Options

```javascript
$('#breadcrumb').bearings({
	items: [],
	listClass: 'breadcrumb',
	navClass: 'pagination crumb-nav',
	rootLinkClass: 'tip-top crumb-home',
	scrollLeftLinkClass: 'left-nudge',
	scrollRightLinkClass: 'right-nudge',
	firstItemListClass: 'first-crumb',
	listContainerClass: 'list-container',
	maxScroll: 100,
	rightPadding: 30,
	isLastItemClickable: true,
	onRootMouseEnter: '',
	onRootMouseLeave: ''
});
```
