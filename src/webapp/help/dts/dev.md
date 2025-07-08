## 开发指南 {docsify-ignore}

### 数据服务

数据集查询使用需要使用租户ID时：

- `$OPLUS_TNT$`: 无需硬编码指定当前租户id，使用`$OPLUS_TNT$`变量即可，在查询时会自动替换为当前登录用户所在的租户ID

主机选择器，数据集宏使用:

- `$plugin_find_host(:hostKeys)$` 当使用主机选择器，进行数据集过滤查询时，使用数据集宏`$plugin_find_host()$`，其中`:hostKeys`为主机选择器所选主机，分组，标签等参数集合，名称可自定义,
  宏的返回结果为hostkeys

示例：
```sql
SELECT
    ch.hostname,
	ch.host_key,
    sp.os_distro,
    sp.os_version,
	sp.scan_date
FROM
	spm_pkg sp
INNER JOIN cm2_host ch
ON ch.host_key = sp.host_key
WHERE
sp.host_key in ($plugin_find_host(:hostKeys)$)
AND
(case when (:ids is null or LENGTH(trim(:ids)) = 0)
              then false else find_in_set(sp.repo_id,(SELECT
	GROUP_CONCAT(spr.refid) refids
FROM
	spm_pkg_repo spr
WHERE
(CASE WHEN (:ids is null or LENGTH(trim(:ids )) = 0 ) THEN false ELSE find_in_set(spr.id,:ids ) END ))) end)
AND sp.tenant_id = $OPLUS_TNT$
GROUP BY sp.host_key
ORDER BY sp.scan_date DESC
```
