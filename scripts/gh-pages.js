import { publish } from 'gh-pages';

publish(
    'public',
    {
        branch: 'gh-pages',
        silent: true,
        repo: 'https://github.com/kylejohnsonkj/cityseeker.git',
        user: {
            name: 'Kyle Johnson',
            email: 'kyjohnson09@gmail.com'
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)