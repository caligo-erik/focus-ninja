# focus-ninja

Functions to help manipulate FOCUS data

## 🏷️ extractTags – A Simple Tag Extractor for FinOps Data

`extractTags` is a lightweight TypeScript function that extracts specific tag values from a **JSON-encoded string**. If a tag is missing, it can return a fallback value.

#### 🎯 **Why Use This?**

- You have FinOps FOCUS data stored as JSON strings.
- You need to extract only certain **tags** from the JSON.
- Some tags might be missing, so you want **fallback values**.
- You want a **simple, sandbox-safe function** (no file system or external dependencies).

---

### 🚀 **Installation**

```sh
npm install focus-ninja
```

### 📌 Usage

Basic Example

```typescript
import { extractTags } from 'focus-ninja';

const tagString = '{"project": "FinOps", "environment": "prod"}';
const keys = ['project', 'environment', 'costCenter'];
const fallbacks = { costCenter: 'defaultCostCenter' };

const result = extractTags(tagString, keys, fallbacks);
console.log(result);
// Output: { project: "FinOps", environment: "prod", costCenter: "defaultCostCenter" }
```
