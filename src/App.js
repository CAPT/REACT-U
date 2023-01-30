import React, { useState, useEffect } from 'react'
import './App.css'
import { usePosts } from './hooks/usePosts'
import PostFilter from './components/PostFilter'
import PostForm from './components/PostForm'
import PostList from './components/PostList'
import MyButton from './components/UI/button/MyButton'
import MyModal from './components/UI/modal/MyModal'
import PostService from './API/PostService'
import MyLoader from './components/UI/loader/MyLoader'
import { useFetching } from './hooks/useFetching'
import { getPageCount, getPagesArray } from './utils/pages'

function App() {
    const [posts, setPosts] = useState([])

    const [filter, setFilter] = useState({ sort: '', query: '' })
    const [modalVisible, setModalVisible] = useState(false)
    const [totalPages, setTotalPages] = useState(0)
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query)

    const pagesArray = getPagesArray(totalPages)

    const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
        const response = await PostService.getAll(limit, page)
        setPosts(response.data)
        const totalCount = response.headers['x-total-count']
        setTotalPages(getPageCount(totalCount, limit))
    })

    const createPost = (newPost) => {
        setPosts([...posts, newPost])
        setModalVisible(false)
        console.log(1)
    }

    const removePost = (post) => {
        setPosts(posts.filter((p) => p.id !== post.id))
    }

    const changePage = (page) => {
        setPage(page)
        // fetchPosts()
    }

    useEffect(() => {
        fetchPosts()
    }, [page])

    return (
        <div className="App">
            <MyButton style={{ marginTop: '30px' }} onClick={fetchPosts}>
                Получить посты
            </MyButton>
            <MyButton
                style={{ marginTop: '30px' }}
                onClick={() => setModalVisible(true)}
            >
                Добавить пост
            </MyButton>
            <MyModal visible={modalVisible} setVisible={setModalVisible}>
                <PostForm create={createPost} />
            </MyModal>

            <hr style={{ margin: '15px 0' }} />
            <PostFilter filter={filter} setFilter={setFilter} />
            {postError && <h1>Ошибка: ${postError}</h1>}
            {isPostsLoading ? (
                <MyLoader />
            ) : (
                <PostList
                    remove={removePost}
                    posts={sortedAndSearchedPosts}
                    title="Список постов"
                />
            )}
            <div className="page__wrapper">
                {pagesArray.map((p) => (
                    <span
                        className={page === p ? 'page page__current' : 'page'}
                        key={p}
                        onClick={() => changePage(p)}
                    >
                        {p}
                    </span>
                ))}
            </div>
        </div>
    )
}

export default App
