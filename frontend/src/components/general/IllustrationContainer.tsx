import { cn } from '@anesok/utils/tailwindHelper';
import Image from 'next/image'
import React from 'react';

interface IllustrationContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  path: 'noConversation';
  description?: string;
  width?: number;
  height?: number;
}

const IllustrationContainer = React.forwardRef<HTMLDivElement, IllustrationContainerProps>(
  ({ className,width=100,height=100,description,path, ...props }, ref) => {
    return <div dir={'rtl'} ref={ref} className={cn('w-full h-fit flex items-center justify-center p-4 sm:p-0', className)} {...props}>
         <div className='w-fit'>
             <Image src={`/icons/${path}.svg`} width={width} height={height} className='mx-auto' alt='illustration'/>
             {description && <p className='w-full max-w-sm text-xs text-center py-2'>{description}</p>}
        </div>

    </div>
  }
);

IllustrationContainer.displayName = 'IllustrationContainer';

export default IllustrationContainer;
