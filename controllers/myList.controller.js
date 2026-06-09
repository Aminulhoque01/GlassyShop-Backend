export const addToMyListController = async (request, response) => {
  try {
  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};
