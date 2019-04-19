export function addExpense(payload) {
  return { type: "ADD_EXPENSE", payload }
};

export function editExpense(payload) {
  return { type: "EDIT_EXPENSE", payload }
};

export function delExpense(payload) {
  return { type: "DEL_EXPENSE", payload }
};

export function editConfig(payload) {
  return { type: "EDIT_CONFIG", payload }
};

export function mergeExpenses(payload) {
  return { type: "MERGE_EXPENSES", payload }
};