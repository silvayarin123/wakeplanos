import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'WAKE — Propostas',description:'Propostas comerciais com estratégia, clareza e personalidade.',robots:{index:false,follow:false},icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>}
