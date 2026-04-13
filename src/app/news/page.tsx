import { redirect } from 'next/navigation';

export default function NewsToBlogRedirect() {
  redirect('/blog');
}
