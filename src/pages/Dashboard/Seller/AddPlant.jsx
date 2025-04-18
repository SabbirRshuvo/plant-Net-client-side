import { Helmet } from "react-helmet-async";
import AddPlantForm from "../../../components/Form/AddPlantForm";
import { uploadImage } from "../../../api/utilies";
import useAuth from "../../../hooks/useAuth";
import { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const AddPlant = () => {
  const [uploadButton, setUploadButton] = useState("Upload image");
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const description = form.description.value;
    const category = form.category.value;
    const price = parseFloat(form.price.value);
    const quantity = parseInt(form.quantity.value);
    const image = form.image.files[0];
    const imageUrl = await uploadImage(image);
    // seller information
    const seller = {
      name: user?.displayName,
      email: user?.email,
      image: user?.photoURL,
    };
    const plantData = {
      name,
      description,
      price,
      category,
      quantity,
      image: imageUrl,
      seller,
    };
    console.log(plantData);
    // send the data in the database
    try {
      await axiosSecure.post(`/plants`, plantData);
      toast.success("successfully added data");
      form.reset();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Add Plant | Dashboard</title>
      </Helmet>

      {/* Form */}
      <AddPlantForm
        loading={loading}
        setUploadButton={setUploadButton}
        uploadButton={uploadButton}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AddPlant;
