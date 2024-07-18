'use client'

import { useState } from "react";
import { Input } from "./ui/input";
import { FaPlus } from "react-icons/fa";
import { Button } from "./ui/button";

export default function NewMenus() {

    const [newMenuName, setNewMenuName] = useState('');
    
    const handleAddMenu = async () => {
        await fetch('/api/menus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newMenuName }),
        });
        window.location.reload();
    };

    return (
        <div className="flex justify-center items-center gap-2">
            <Input
                type="text"
                value={newMenuName}
                onChange={(e) => setNewMenuName(e.target.value)}
                placeholder="Novo Menu"
                className="text-bg"
            />
            <Button onClick={handleAddMenu}>
                <FaPlus />
            </Button>
        </div>
    )
}