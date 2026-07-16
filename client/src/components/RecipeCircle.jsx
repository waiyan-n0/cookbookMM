const RecipeCircle =({ title, image, link }) => {
    return (
        <a href={link} className='flex flex-col items-center gap-2 group cursor-pointer no-underline text-inherit'>
            <span className='border w-32 h-32 rounded-full overflow-hidden transition-transform group-hover:scale-105'>
                <img className='w-full h-full object-cover' src={image} alt={title} />
            </span>
            <span className='text-sm font-medium group-hover:text-blue-600 transition-colors'>
                {title}
            </span>
        </a>
    );
}
export default RecipeCircle;