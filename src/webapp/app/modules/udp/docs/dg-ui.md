# UI

## 表单

增加了几个样式
- `op-smartform`
- `form-control-wrapper`
- `op-form-actions`

`form-{style}`，`style`可以是`inline`、`horizontal`、`vertical`

````html
<div class="form-{style} op-smartform">
    <div class="form-group">
        <label class="control-label">Label</label> 
        <div class="form-control-wrapper">
            <input class="form-control">
        </div>
    </div>
    <div class="form-group">
        <label class="control-label">Label</label> 
        <div class="form-control-wrapper">
            <input class="form-control">
        </div>
    </div>
    <div class="form-group op-form-actions">
        <button type="button" class="btn btn-primary">提交</button>
        <button type="button" class="btn btn-default">取消</button>
    </div>
</div>
````

