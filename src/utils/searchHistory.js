/**
 * Save a search query or video title to search history
 * @param {string} query - The search term or video title to save
 */
export const saveToSearchHistory = (query) => {
	const trimmedQuery = query.trim()
	if (!trimmedQuery) return

	try {
		const history = JSON.parse(localStorage.getItem('searchHistory')) || []
		const newSearch = {
			query: trimmedQuery,
			timestamp: new Date().toISOString()
		}

		// Add to beginning and remove duplicates, keep only last 20
		const updatedHistory = [
			newSearch,
			...history.filter(item => item.query.toLowerCase() !== trimmedQuery.toLowerCase())
		].slice(0, 20)

		localStorage.setItem('searchHistory', JSON.stringify(updatedHistory))
	} catch (error) {
		console.error('Error saving to search history:', error)
	}
}

/**
 * Get search history from localStorage
 * @returns {Array} Array of search history items
 */
export const getSearchHistory = () => {
	try {
		const stored = localStorage.getItem('searchHistory')
		return stored ? JSON.parse(stored) : []
	} catch (error) {
		console.error('Error loading search history:', error)
		return []
	}
}
