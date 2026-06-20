function calculateRemainingDays(expireDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expire = new Date(expireDate + "T00:00:00");
  const diff = expire - today;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getCategorizedLists(foods) {
  const active = foods.filter((f) => !f.finished);
  const completed = foods.filter((f) => f.finished);

  const expired = [];
  const danger = [];
  const warning = [];
  const safe = [];

  active.forEach((food) => {
    const days = calculateRemainingDays(food.expireDate);
    if (days < 0) {
      expired.push(food);
    } else if (days <= 2) {
      danger.push(food);
    } else if (days <= 5) {
      warning.push(food);
    } else {
      safe.push(food);
    }
  });

  const sortFn = (a, b) => a.expireDate.localeCompare(b.expireDate);
  expired.sort(sortFn);
  danger.sort(sortFn);
  warning.sort(sortFn);
  safe.sort(sortFn);

  return { expired, danger, warning, safe, completed };
}
