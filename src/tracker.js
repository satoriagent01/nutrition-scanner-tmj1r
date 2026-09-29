/**
 * Tracker module - Register meals and view history
 */

/**
 * Create a new tracker instance
 * @returns {Object} Tracker instance
 */
export function createTracker() {
  const meals = [];

  return {
    /**
     * Register a meal
     * @param {Object} meal - The meal to register
     * @param {string} meal.name - Name of the meal
     * @param {Date} meal.date - Date of the meal
     * @param {Array} meal.dishes - Array of dishes in the meal
     * @returns {Object} The registered meal
     */
    registerMeal(meal) {
      const registeredMeal = {
        id: Date.now().toString(),
        name: meal.name,
        date: meal.date || new Date(),
        dishes: meal.dishes || [],
        totalNutrition: meal.totalNutrition || {}
      };
      meals.push(registeredMeal);
      return registeredMeal;
    },

    /**
     * Get all registered meals
     * @returns {Array} Array of all meals
     */
    getMeals() {
      return [...meals];
    },

    /**
     * Get meals for a specific date
     * @param {Date} date - The date to filter by
     * @returns {Array} Array of meals for the given date
     */
    getMealsByDate(date) {
      const dateStr = date.toDateString();
      return meals.filter(meal => meal.date.toDateString() === dateStr);
    },

    /**
     * Get total nutrition for a specific date
     * @param {Date} date - The date to calculate totals for
     * @returns {Object} Total nutrition values for the date
     */
    getTotalNutritionByDate(date) {
      const dayMeals = this.getMealsByDate(date);
      const totals = {
        energy: 0,
        fat: 0,
        saturatedFat: 0,
        carbohydrates: 0,
        sugars: 0,
        fiber: 0,
        protein: 0,
        salt: 0
      };

      dayMeals.forEach(meal => {
        if (meal.totalNutrition) {
          Object.keys(totals).forEach(key => {
            if (meal.totalNutrition[key]) {
              totals[key] += meal.totalNutrition[key];
            }
          });
        }
      });

      return totals;
    },

    /**
     * Delete a meal by ID
     * @param {string} id - The meal ID to delete
     * @returns {boolean} True if deleted, false if not found
     */
    deleteMeal(id) {
      const index = meals.findIndex(meal => meal.id === id);
      if (index !== -1) {
        meals.splice(index, 1);
        return true;
      }
      return false;
    }
  };
}