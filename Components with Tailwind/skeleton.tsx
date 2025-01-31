import React from "react";

const Skeleton = ({type = "text", children}) => {
    let skeletonClass = "animate-pulse bg-gray-400 rounded-md p-2 m-2";

    if (type === "card") {
        skeletonClass = "animate-pulse bg-gray-400 rounded-lg shadow-md p-4 m-2";
    } else if (type === "input") {
        skeletonClass = "animate-pulse bg-gray-400 rounded-md p-2";
    }

    return <div className={skeletonClass}>{children}</div>;
};

export default Skeleton;