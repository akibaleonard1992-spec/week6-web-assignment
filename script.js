const expenseForm = document.getElementById("expenseForm");
const expenseNameInput = document.getElementById("expenseName");
const expenseAmountInput = document.getElementById("expenseAmount");
const expenseCategoryInput = document.getElementById("expenseCategory");
const budgetInput = document.getElementById("monthlyBudget");
const formMessage = document.getElementById("formMessage");
const expenseList = document.getElementById("expenseList");
const expenseCount = document.getElementById("expenseCount");
const budgetValue = document.getElementById("budgetValue");
const spentValue = document.getElementById("spentValue");
const remainingValue = document.getElementById("remainingValue");
const budgetStatus = document.getElementById("budgetStatus");
const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");
const progressTrack = document.querySelector(".progress-track");
const themeButton = document.getElementById("themeButton");
const themeIcon = document.getElementById("themeIcon");

let monthlyBudget = 2500;
let expenses = [];

const currency = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES"
});

const categoryIcons = {
  Food: "🍴",
  Transport: "🚗",
  Housing: "⌂",
  Entertainment: "★",
  Utilities: "⚡",
  Other: "•"
};

function getTotalSpent() {
  let total = 0;

  for (let index = 0; index < expenses.length; index += 1) {
    total += expenses[index].amount;
  }

  return total;
}

function renderExpenses() {
  expenseList.innerHTML = "";

  if (expenses.length === 0) {
    expenseList.innerHTML = `
      <div class="empty-state" id="emptyState">
        <div class="empty-icon" aria-hidden="true">◎</div>
        <p>No expenses yet</p>
        <span>Add one to start tracking.</span>
      </div>
    `;
  } else {
    for (let index = 0; index < expenses.length; index += 1) {
      const expense = expenses[index];
      const item = document.createElement("article");
      item.className = "expense-item";
      item.innerHTML = `
        <div class="expense-icon" aria-hidden="true">${categoryIcons[expense.category]}</div>
        <div class="expense-details">
          <p class="expense-name">${escapeHtml(expense.name)}</p>
          <span class="expense-category">${expense.category}</span>
        </div>
        <span class="expense-amount">${currency.format(expense.amount)}</span>
        <button class="delete-button" type="button" data-index="${index}" aria-label="Delete ${escapeHtml(expense.name)}">×</button>
      `;
      expenseList.appendChild(item);
    }
  }

  expenseCount.textContent =
    expenses.length === 1 ? "1 expense" : `${expenses.length} expenses`;
}

function escapeHtml(value) {
  const element = document.createElement("span");
  element.textContent = value;
  return element.innerHTML;
}

function updateDashboard() {
  const totalSpent = getTotalSpent();
  const remaining = monthlyBudget - totalSpent;
  const rawPercent = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;
  const displayPercent = Math.round(rawPercent);
  const fillPercent = Math.min(rawPercent, 100);

  budgetValue.textContent = currency.format(monthlyBudget);
  spentValue.textContent = currency.format(totalSpent);
  remainingValue.textContent = currency.format(remaining);
  progressPercent.textContent = `${displayPercent}%`;
  progressFill.style.width = `${fillPercent}%`;
  progressTrack.setAttribute("aria-valuenow", String(Math.min(displayPercent, 100)));

  if (remaining < 0) {
    budgetStatus.textContent = "Over budget";
    budgetStatus.style.color = "var(--danger)";
    progressFill.style.background = "var(--danger)";
  } else if (rawPercent >= 80) {
    budgetStatus.textContent = "Nearly at limit";
    budgetStatus.style.color = "var(--warning)";
    progressFill.style.background = "var(--warning)";
  } else {
    budgetStatus.textContent = "On track";
    budgetStatus.style.color = "var(--success)";
    progressFill.style.background = "var(--primary)";
  }

  renderExpenses();
}

function showMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
}

expenseForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = expenseNameInput.value.trim();
  const amount = Number(expenseAmountInput.value);
  const category = expenseCategoryInput.value;
  const enteredBudget = Number(budgetInput.value);

  if (name === "") {
    showMessage("Please enter an expense name.", "error");
    expenseNameInput.focus();
    return;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    showMessage("Please enter a valid amount greater than KSh 0.", "error");
    expenseAmountInput.focus();
    return;
  }

  if (!Number.isFinite(enteredBudget) || enteredBudget <= 0) {
    showMessage("Please enter a valid monthly budget.", "error");
    budgetInput.focus();
    return;
  }

  monthlyBudget = enteredBudget;
  expenses.push({
    name: name,
    amount: amount,
    category: category
  });

  expenseNameInput.value = "";
  expenseAmountInput.value = "";
  expenseCategoryInput.value = "Food";
  showMessage("Expense added successfully.", "success");
  expenseNameInput.focus();
  updateDashboard();
});

expenseList.addEventListener("click", function (event) {
  const deleteButton = event.target.closest(".delete-button");

  if (!deleteButton) {
    return;
  }

  const index = Number(deleteButton.dataset.index);
  if (Number.isInteger(index) && index >= 0 && index < expenses.length) {
    expenses.splice(index, 1);
    showMessage("Expense removed.", "success");
    updateDashboard();
  }
});

budgetInput.addEventListener("input", function () {
  const enteredBudget = Number(budgetInput.value);

  if (Number.isFinite(enteredBudget) && enteredBudget > 0) {
    monthlyBudget = enteredBudget;
    updateDashboard();
  }
});

themeButton.addEventListener("click", function () {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeIcon.textContent = isDark ? "☀" : "☾";
  themeButton.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode"
  );
});

updateDashboard();
