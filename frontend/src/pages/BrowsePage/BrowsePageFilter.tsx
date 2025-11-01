import { useState, type FormEventHandler } from "react"
import FormField from "../../components/util/FormField.tsx"
import { useBrowseContext } from "../../context/BrowseContext.tsx"


function BrowsePageFilter() {

    const b = useBrowseContext()

    const [formData, setFormData] = useState<BrowseParams>({...b.params})

    const handleUpdate: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        b.setParams(formData)
    }

    const handleSortChange = (v: string) => {
        let sort = formData.sort
        let order = formData.order
        switch (v) {
            case 'name_asc':
                sort = 'name'
                order = 1
                break
            case 'name_desc':
                sort = 'name'
                order = -1
                break
            case 'price_asc':
                sort = 'pricePerNight'
                order = 1
                break
            case 'price_desc':
                sort = 'pricePerNight'
                order = -1
                break
        }
        setFormData(d => ({...d, sort, order}))
    }

    return (
        <form onSubmit={handleUpdate}>
            <FormField label="Min. price/night">
                <input 
                    type="number" 
                    defaultValue={formData.minPrice} 
                    min={0}
                    max={formData.maxPrice}
                    step={25}
                    onChange={e => setFormData(d => ({...d, minPrice: Number(e.target.value)}))}
                />
            </FormField>
            <FormField label="Max. price/night">
                <input 
                    type="number" 
                    defaultValue={formData.maxPrice} 
                    min={formData.minPrice}
                    max={5000}
                    step={25}
                    onChange={e => setFormData(d => ({...d, maxPrice: Number(e.target.value)}))}
                />
            </FormField>
            <FormField label="Sort by">
                <select onChange={e => handleSortChange(e.target.value)}>
                    <option value="name_asc">Name (ascending)</option>
                    <option value="name_desc">Name (descending)</option>
                    <option value="price_asc">Price (ascending)</option>
                    <option value="price_desc">Price (descending)</option>
                </select>
            </FormField>
            {/* <FormField label="Show unavailable properties">
                <input 
                    type="checkbox" 
                    defaultChecked={formData.showUnavailable} 
                    onChange={e => setFormData(d => ({...d, showUnavailable: e.target.checked }))} 
                />
            </FormField> */}
            <button>Update</button>
        </form>
    )
}

export default BrowsePageFilter;