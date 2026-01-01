const API_KEY = '06aeb417b7b7bc22ac0ad1b344f043b6';
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchPopularMovie = async (page = 1) => {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`)
    const data = await response.json();
    return data; // return full payload (results, page, total_pages)

}

export const SearchMovie = async (query, page = 1) => {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
    const data = await response.json();
    return data;

}