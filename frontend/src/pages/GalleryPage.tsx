import React from 'react';
import { Camera } from 'lucide-react';


export const GalleryPage: React.FC = () => {
  const albums = [
    { title: 'Annual Celebration 2026', count: '48 Photos', date: 'Sep 2026', color: 'from-[#fce7f3] to-[#fbcfe8]' },
    { title: 'Summer Camp Memories', count: '124 Photos', date: 'Aug 2026', color: 'from-[#dcfce7] to-[#bbf7d0]' },
    { title: 'Sunday Class Activities', count: '89 Photos', date: 'Ongoing', color: 'from-[#e0f2fe] to-[#bae6fd]' },
    { title: 'Cultural Competitions', count: '62 Photos', date: 'Jul 2026', color: 'from-[#fef3c7] to-[#fde68a]' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 md:pb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2d1f19]">Media Gallery</h1>
        <p className="text-sm text-[#8c7b75]">Photo and video archives of Vivekananda Balaka Sangha events</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {albums.map((album) => (
          <div
            key={album.title}
            className="bg-white rounded-2xl border border-[#efe6da] shadow-card overflow-hidden group cursor-pointer hover:border-[#c85a28] transition-all"
          >
            <div className={`h-40 bg-gradient-to-br ${album.color} flex flex-col items-center justify-center p-4 text-[#2d1f19]`}>
              <Camera className="w-10 h-10 text-[#2d1f19]/60 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold mt-2 text-[#6e5c54]">{album.date}</span>
            </div>
            <div className="p-4 space-y-1">
              <h3 className="font-bold text-[#2d1f19] group-hover:text-[#c85a28] transition-colors">{album.title}</h3>
              <p className="text-xs text-[#8c7b75]">{album.count}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
