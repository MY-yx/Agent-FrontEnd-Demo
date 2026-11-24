# Mini Shop（靶场仓库）

给 Agent 练手用的 Vue 3 + TypeScript 小型商城。它是 Agent 修改的**目标**，不是 Agent 本身的代码（那部分在 `../Base`）。

## 准备

```bash
npm install
npm test          # 全部测试应该通过
git init && git add -A && git commit -m "初始状态"
```

每次让 Agent 改完之后，用 git 回到初始状态：

```bash
git reset --hard && git clean -fd
```

## 命令

| 命令 | 作用 |
|---|---|
| `npm test` | 运行全部测试（一次性，不监听） |
| `npm run typecheck` | 类型检查，包括 `.vue` 文件 |
| `npm run dev` | 启动页面 |
| `npm run build` | 类型检查并打包 |

只跑某一个测试文件：`npx vitest run tests/utils/discount.test.ts`

## 结构

```
src/
  types.ts                  类型定义
  data/products.ts          商品数据
  utils/                    纯函数，不依赖 Vue
    format.ts               金额、日期、库存文案
    array.ts                分组、排序、去重
    pagination.ts           分页计算、页码序列
    validate.ts             邮箱、手机号、结算表单校验
    discount.ts             优惠券、运费
  composables/              带状态的逻辑
    useCart.ts              购物车：增删改、优惠券、运费、合计
    useProductFilter.ts     搜索、筛选、排序
    usePagination.ts        分页状态
    useLocalStorage.ts      和 localStorage 同步的 ref
  components/               组件
    ProductCard / ProductList / SearchBar / Pagination
    CartItem / CartSummary / CouponInput / CheckoutForm
    BaseButton / EmptyState
  App.vue                   把以上部分组装起来
tests/                      目录结构和 src 对应，共 17 个文件、127 个测试
```

## 约定

- **金额一律用整数"分"**。只在显示时用 `formatPrice` 转成元，计算过程中不出现小数
- **运费按优惠后的金额判断**：优惠后满 ¥99 免运费，否则 ¥8
- **优惠券不满足条件时优惠为 0，但不会被自动移除**，条件恢复后重新生效
- 组件里用 `data-test` 属性标记测试要查找的元素
