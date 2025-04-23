import React from 'react'
import { FaHome } from "react-icons/fa";
import { FaBook } from "react-icons/fa6";
import { FcTodoList } from "react-icons/fc";

export const NavbarData = [
    {
        title:"Home",
        icon:<FaHome/>,
        link:"/home"
    },
    {
        title:"Journal",
        icon:<FaBook/>,
        link:"/journal"
    },
    /*{
        title:"Journal Entries",
        icon:<FaBook/>,
        link:"/journalentries"
    },*/
    {
        title:"Habit",
        icon:<FcTodoList/>,
        link:"/habit"
    },
    {
        title:"Dashboard",
        icon:<FcTodoList/>,
        link:"/dashboard"
    }

]